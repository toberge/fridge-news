// @flow

import * as React from 'react';
import { Component } from 'react-simplified';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import { capitalizeFirstLetter } from '../../data/Article';
import { articleStore } from '../../stores/articleStore';
import Form from './../shared/Form';
import { createHashHistory } from 'history';
import Icon from '../shared/Icon';
import Notifier from '../shared/Notifier';

const history = createHashHistory();

export class ArticleWriter extends Component<{ match: { params: { id: number } } }> {
  pending: boolean = false;

  render() {
    return (
      <main>
        <h1>Write Article</h1>
        <EditorForm pending={this.pending} handleUpload={this.handleUpload} save={false} />
      </main>
    );
  }

  mounted() {
    document.title = 'Write Article - Fridge News';
    articleStore.clearArticle();
  }

  async handleUpload(event: SyntheticInputEvent<HTMLFormElement>) {
    event.preventDefault();
    // no need to validate (except image?) - already done by form

    // disable button (+ possible additional effects)
    this.pending = true;

    // set no picture at all if picture is null
    if (!articleStore.currentArticle.picturePath || articleStore.currentArticle.picturePath === '') {
      articleStore.currentArticle.picturePath = null;
      articleStore.currentArticle.pictureAlt = null;
      articleStore.currentArticle.pictureCapt = null;
    } else {
      // TODO test if image exists, run a GET request?
    }

    // actually POST the article, moving user to article page afterwards
    try {
      let newId = await articleStore.addArticle();
      if (newId && newId > 0) {
        history.push('/articles/' + newId);
        return;
      } else {
        Notifier.error('Posting article failed with unknown error.');
      }
    } catch (e) {
      Notifier.error(`Posting article failed\n${e.message}`);
    }
    this.pending = false;
  }
}

export class ArticleEditor extends Component<{ match: { params: { id: number } } }> {
  pending: boolean = false;

  render() {
    return (
      <main>
        <h1>Edit Article</h1>
        <EditorForm pending={this.pending} handleUpload={this.handleSave} save={true} />
      </main>
    );
  }

  mounted() {
    document.title = 'Edit Article - Fridge News';
  }

  async handleSave(event: SyntheticInputEvent<HTMLFormElement>) {
    event.preventDefault();
    // no need to validate (except image?) - already done by form

    // disable button (+ possible additional effects)
    this.pending = true;

    // set no picture at all if picture is null
    if (!articleStore.currentArticle.picturePath || articleStore.currentArticle.picturePath === '') {
      articleStore.currentArticle.picturePath = null;
      articleStore.currentArticle.pictureAlt = null;
      articleStore.currentArticle.pictureCapt = null;
    } else {
      // TODO test if image exists, run a GET request?
    }

    try {
      if (await articleStore.updateArticle()) {
        history.push('/articles/' + articleStore.currentArticle.id);
        return;
      } else {
        Notifier.error('Updating article failed with unknown error.');
      }
    } catch (e) {
      Notifier.error(`Updating article failed\n${e.message}`);
    }
    // not pending no more
    this.pending = false;
  }
}

class EditorForm extends Component<{ pending: boolean, handleUpload: (event: any) => mixed, save?: boolean }> {
  hasPicture: boolean = false;

  handleMarkdownChange(value: string) {
    articleStore.currentArticle.text = value;
  }

  handleTitleChange(event: SyntheticInputEvent<HTMLInputElement>) {
    const value = event.target.value;
    if (value !== null && value.length < 64) {
      articleStore.currentArticle.title = value;
      if (value.length === 0) {
        event.target.setCustomValidity('Title must not be empty');
      } else {
        event.target.setCustomValidity('');
      }
    } else {
      console.log(event.target.validationMessage);
      event.target.setCustomValidity('Title must be no more than 64 letters');
    }
  }

  handlePicturePathChange(event: SyntheticInputEvent<HTMLInputElement>) {
    const value = event.target.value;
    if (value && value.length < 256) {
      this.hasPicture = true;
    } else if (!value) {
      this.hasPicture = false;
    }
    articleStore.currentArticle.picturePath = value;
  }

  handlePictureAltChange(event: SyntheticInputEvent<HTMLInputElement>) {
    const value = event.target.value;
    if (this.hasPicture && value != null && value.length < 64) {
      articleStore.currentArticle.pictureAlt = value;
    }
  }

  handlePictureCaptChange(event: SyntheticInputEvent<HTMLInputElement>) {
    const value = event.target.value;
    if (this.hasPicture && value != null && value.length < 64) {
      articleStore.currentArticle.pictureCapt = value;
    }
  }

  render() {
    return (
      <form onSubmit={this.props.handleUpload}>
        {/*====== title ======*/}
        <Form.Group>
          <div className="row">
            <label htmlFor="title" className="col-sm-2 col-form-label col-form-label-lg">
              Title
            </label>
            <div className="col-sm-8">
              <input
                id="title"
                className="form-control form-control-lg"
                type="text"
                placeholder="Your wonderful title"
                aria-describedby="titleHelp"
                value={articleStore.currentArticle.title}
                onChange={this.handleTitleChange}
                required
              />
              <small id="titleHelp" className="form-text text-muted">
                Please pick a catchy title that fits the content of your article
              </small>
            </div>
          </div>
        </Form.Group>
        {/*====== image (needs image preview) ======*/}
        <div className="form-group">
          {/*<div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text" id="imgSpan">
                  Upload
                </span>
              </div>
              <div className="custom-file">
                <input
                  type="file"
                  className="custom-file-input"
                  id="imgFile"
                  onChange={event => (articleStore.currentArticle.picturePath = URL.createObjectURL(event.target.files[0]))}
                  aria-describedby="imgSpan"
                  required={this.hasPicture}
                />
                <label className="custom-file-label" htmlFor="imgFile">
                  Choose a suitable image
                </label>
              </div>
            </div>*/}
          <div className="row">
            <label htmlFor="imgPath" className="col col-form-label">
              Image URL
            </label>
            <div className="col-10">
              <input
                id="imgPath"
                className="form-control"
                type="text"
                placeholder="https://stuff.com/pictures/123456789.jpg"
                value={articleStore.currentArticle.picturePath}
                onChange={this.handlePicturePathChange}
                aria-describedby="imgPathHelp"
                required={this.hasPicture}
              />
              <small id="imgPathHelp" className="form-text text-muted">
                Provide a URL to an image - <strong>if you do, alt and caption are required too!</strong>
              </small>
            </div>
          </div>
          {/*====== image preview ======*/}
          <div className="card align-items-center p-3 text-center">
            <img src={articleStore.currentArticle.picturePath} className="card-img w-25" alt="[ Preview ]" />
          </div>
          <p></p>
          {/* shitty hack */}
          <div className="row">
            <label htmlFor="imgAlt" className="col col-form-label">
              Alt-Text
            </label>
            <div className="col-10">
              <input
                id="imgAlt"
                className="form-control"
                type="text"
                placeholder="Image content description"
                value={articleStore.currentArticle.pictureAlt}
                onChange={this.handlePictureAltChange}
                aria-describedby="imgAltHelp"
                required={this.hasPicture}
              />
              <small id="imgAltHelp" className="form-text text-muted">
                An alt-text will let people with bad vision get an idea of what it depicts (or if it does not load)
              </small>
            </div>
          </div>
          <p></p>
          {/* shitty hack */}
          <div className="row">
            <label htmlFor="imgCapt" className="col col-form-label">
              Image Caption
            </label>
            <div className="col-10">
              <input
                id="imgCapt"
                className="form-control"
                type="text"
                placeholder="Image caption"
                value={articleStore.currentArticle.pictureCapt}
                onChange={(event: SyntheticInputEvent<HTMLInputElement>) =>
                  (articleStore.currentArticle.pictureCapt = event.target.value)
                }
                aria-describedby="imgCaptHelp"
                required={this.hasPicture}
              />
              <small id="imgCaptHelp" className="form-text text-muted">
                Please provide a caption for your image, containing further details
              </small>
            </div>
          </div>
        </div>
        {/*====== markdown text ======*/}
        <Form.Group>
          <SimpleMDE
            value={articleStore.currentArticle.text}
            onChange={this.handleMarkdownChange}
            label="Main text"
            options={{ spellChecker: false }}
          />
        </Form.Group>
        {/*====== category and tags ======*/}
        <Form.Group>
          <div className="col-3">
            <label htmlFor="category">Category</label>
            <select
              className="custom-select"
              // onInvalid={event => console.log('TODO')}
              id="category"
              value={articleStore.currentArticle.category}
              onChange={(event: SyntheticInputEvent<HTMLInputElement>) => {
                if (event.target.value) articleStore.currentArticle.category = event.target.value;
              }}
              required
            >
              <option value="">Select category...</option>
              {articleStore.categories.map(c => (
                <option value={c} key={c}>
                  {capitalizeFirstLetter(c)}
                </option>
              ))}
            </select>
          </div>
          <div className="col-3">
            <label htmlFor="importance">Importance</label>
            <select
              className="custom-select"
              id="importance"
              value={articleStore.currentArticle.importance}
              onChange={(event: SyntheticInputEvent<HTMLInputElement>) => {
                if (event.target.value) articleStore.currentArticle.importance = parseInt(event.target.value);
              }}
              required
            >
              <option value="1">1 - Important (on front page)</option>
              <option value="2">2 - Less important</option>
            </select>
          </div>
        </Form.Group>
        {/*<Form.Submit disabled={this.props.pending} value={this.props.buttonText} />*/}
        <Form.Submit disabled={this.props.pending}>
          {this.props.save ? <Icon.Save /> : <Icon.Upload />}
          {this.props.save ? ' Save' : ' Upload'}
        </Form.Submit>
        {this.props.pending ? (
          <span>
            {' '}
            <Icon.Loading /> Uploading...
          </span>
        ) : null}
      </form>
    );
  }
}
