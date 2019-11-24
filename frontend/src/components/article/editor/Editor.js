// @flow

import * as React from 'react';
import { Component } from 'react-simplified/lib/index';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import { capitalizeFirstLetter } from '../../../data/Article';
import { articleStore } from '../../../stores/articleStore';
import Form from '../../shared/Form';
import { createHashHistory } from 'history';
import Icon from '../../shared/Icon';
import Notifier from '../../shared/Notifier';
import { userStore } from '../../../stores/userStore';

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
    if (!userStore.currentUser) history.push('/login');
    document.title = 'Write Article - Fridge News';
    articleStore.clearArticle();
  }

  async handleUpload(event: SyntheticInputEvent<HTMLFormElement>) {
    event.preventDefault();
    // no need to validate (except image?) - already done by form

    if (articleStore.currentArticle.text === '') return Notifier.error('No text supplied');

    // disable button (+ possible additional effects)
    this.pending = true;

    // set no picture at all if picture is null
    if (!articleStore.currentArticle.picturePath || articleStore.currentArticle.picturePath === '') {
      articleStore.currentArticle.picturePath = null;
      articleStore.currentArticle.pictureAlt = null;
      articleStore.currentArticle.pictureCapt = null;
    } else if (!(await articleStore.testIfImageExists())) {
      Notifier.error("Image does not exist or file isn't an image!");
      this.pending = false;
      return;
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

    if (articleStore.currentArticle.text === '') return Notifier.error('No text supplied');

    // disable button (+ possible additional effects)
    this.pending = true;

    // set no picture at all if picture is null
    if (!articleStore.currentArticle.picturePath || articleStore.currentArticle.picturePath === '') {
      articleStore.currentArticle.picturePath = null;
      articleStore.currentArticle.pictureAlt = null;
      articleStore.currentArticle.pictureCapt = null;
    } else if (!(await articleStore.testIfImageExists())) {
      Notifier.error("Image does not exist or file isn't an image!");
      this.pending = false;
      return;
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
    if (value !== null && value.length <= 64) {
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
    if (value && value.length <= 2083) {
      this.hasPicture = true;
    } else if (!value) {
      this.hasPicture = false;
    }
    articleStore.currentArticle.picturePath = value;
  }

  handlePictureAltChange(event: SyntheticInputEvent<HTMLInputElement>) {
    const value = event.target.value;
    if (this.hasPicture && value != null && value.length <= 64) {
      articleStore.currentArticle.pictureAlt = value;
    }
  }

  handlePictureCaptChange(event: SyntheticInputEvent<HTMLInputElement>) {
    const value = event.target.value;
    if (this.hasPicture && value != null && value.length <= 64) {
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

        {/*====== image ======*/}
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
          <Form.Input
            name="imgPath"
            label="Image URL"
            placeholder="https://stuff.com/pictures/123456789.jpg"
            helpText={
              <>
                Provide a URL to an image - <strong>if you do, alt and caption are required too!</strong>
              </>
            }
            value={articleStore.currentArticle.picturePath}
            onChange={this.handlePicturePathChange}
            required={this.hasPicture}
          />
          {/*====== image preview ======*/}
          <div className="card align-items-center p-3 text-center">
            <img src={articleStore.currentArticle.picturePath} className="card-img w-25" alt="[ Preview ]" />
          </div>
          <p></p>
          <Form.Input
            name="imgAlt"
            label="Alt-Text"
            placeholder="Image content description"
            helpText="An alt-text will let people with bad vision get an idea of what it depicts (or if it does not load)"
            value={articleStore.currentArticle.pictureAlt}
            onChange={this.handlePictureAltChange}
            required={this.hasPicture}
          />
          <p></p>
          <Form.Input
            name="imgCapt"
            label="Image Caption"
            placeholder="Image caption"
            helpText="Please provide a caption for your image, containing further details"
            value={articleStore.currentArticle.pictureCapt}
            onChange={this.handlePictureCaptChange}
            required={this.hasPicture}
          />
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

        {/*====== category and importance ======*/}
        <Form.Group>
          <div className="col-3">
            <label htmlFor="category">Category</label>
            <select
              className="custom-select"
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

        {/*====== submission ======*/}
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
