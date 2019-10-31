// @flow

import * as React from 'react';
import { Component } from 'react-simplified';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import { Article, capitalizeFirstLetter, CATEGORIES } from '../../utils/Article';
import { articleStore } from '../../stores/articleStore';
import { Button, Card, Form } from './../widgets';
import { createHashHistory } from 'history';
import placeholder from '../../assets/images/floppy.jpg';
import LoadingPage from "../LoadingPage";

const history = createHashHistory();

// TODO make it handle editing too - subclass?
export default class ArticleEditor extends Component<{ match: { params: { id: number } } }> {
  article: Article = articleStore.currentArticle;
  form = null;
  pending: boolean = false;

  render() {
    if (this.pending) {
      return <LoadingPage/>;
    } else {
      return (
        <main>
          <h1>Write Article</h1>
          <form ref={f => (this.form = f)}>
            {/*====== title ======*/}
            <Form.Group>
              <div className="row">
                <label htmlFor="title" className="col-sm-1 col-form-label col-form-label-lg">
                  Title
                </label>
                <div className="col-sm-8">
                  <input
                    id="title"
                    className="form-control form-control-lg"
                    type="text"
                    placeholder="Your wonderful title"
                    aria-describedby="titleHelp"
                    onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.article.title = event.target.value)}
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
              <div className="input-group">
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
                    onChange={event => (this.article.picturePath = URL.createObjectURL(event.target.files[0]))}
                    aria-describedby="imgSpan"
                  />
                  <label className="custom-file-label" htmlFor="imgFile">
                    Choose a suitable image
                  </label>
                </div>
              </div>
              {/*====== image preview ======*/}
              <div className="card align-items-center p-3 text-center">
                <img
                  src={this.article.picturePath ? this.article.picturePath : placeholder}
                  className="card-img w-25"
                  alt="[ Preview ]"
                />
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
                    onChange={(event: SyntheticInputEvent<HTMLInputElement>) =>
                      (this.article.pictureAlt = event.target.value)
                    }
                    aria-describedby="imgAltHelp"
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
                    onChange={(event: SyntheticInputEvent<HTMLInputElement>) =>
                      (this.article.pictureCapt = event.target.value)
                    }
                    aria-describedby="imgCaptHelp"
                  />
                  <small id="imgCaptHelp" className="form-text text-muted">
                    Please provide a caption for your image, containing further details
                  </small>
                </div>
              </div>
            </div>
            {/*====== markdown text ======*/}
            <Form.Group>
              <SimpleMDE value={this.article.text} onChange={this.handleMarkdownChange} label="Main text"
                         options={{spellChecker: false}}/>
            </Form.Group>
            {/*====== category and tags ======*/}
            <Form.Group>
              <div className="col-3">
                <label htmlFor="category">Category</label>
                <select
                  className="custom-select"
                  onInvalid={event => console.log('TODO')}
                  id="category"
                  onChange={(event: SyntheticInputEvent<HTMLInputElement>) => {
                    if (event.target.value) this.article.category = event.target.value;
                  }}
                  required
                >
                  <option value="">Select category...</option>
                  {CATEGORIES.map(c => (
                    <option value={c} key={c}>
                      {capitalizeFirstLetter(c)}
                    </option>
                  ))}
                </select>
              </div>
            </Form.Group>
            <Button.Primary onClick={this.handleUpload} disabled={this.pending}>Upload</Button.Primary>
          </form>
        </main>
      );
    }
  }

  mounted() {
    articleStore.clearArticle();
  }

  handleMarkdownChange(value: string) {
    this.article.text = value;
  }

  async handleUpload() {
    console.log(this.article);
    if (!this.form || !this.form.checkValidity()) {
      // TODO make better feedback
      console.log('INVALID');
      return;
    }

    // disable button (+ possible additional effects)
    this.pending = true;


    // set no picture at all if picture is null
    if (!this.article.picturePath) {
      this.article.picturePath = null;
      this.article.pictureAlt = null;
      this.article.pictureCapt = null;
    } else {
      // TODO test if image exists, run a GET request?
    }

    // actually POST the article, moving user to article page afterwards
    try {
      let newId = await articleStore.addArticle();
      if (newId && newId > 0) {
        history.push('/articles/' + newId);
      }
    } catch (e) {
      // TODO handle...
      console.error(e);
    }
  }
}
