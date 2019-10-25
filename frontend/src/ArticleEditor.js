// @flow

import * as React from 'react';
import {Component} from 'react-simplified';
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import {Article} from "./Article";

export class ArticleEditor extends Component<{ match: { params: { id: number } } }> {
  article: Article = new Article(
    'Title',
    'img/eagles.jpg',
    'an eagle',
    'lol',
    '',
    'culture',
    new Date(),
    'somebody',
    2.3
  );

  render() {
    return (
      <div className="card">
        <div className="card-body">
      <form>
        {/*====== title ======*/}
        <div className="form-group">
          <div className="row">
            <label htmlFor="title" className="col-sm-1 col-form-label col-form-label-lg">Title</label>
            <div className="col-sm-8">
              <input id="title" className="form-control form-control-lg" type="text" placeholder="Your wonderful title" aria-describedby="titleHelp"/>
              <small id="titleHelp" className="form-text text-muted">Please pick a catchy title that fits the content of your article</small>
            </div>
          </div>
        </div>
        {/*====== image (needs image preview) ======*/}
        <div className="form-group">
          <div className="input-group">
            <div className="input-group-prepend">
              <span className="input-group-text" id="imgSpan">Upload</span>
            </div>
            <div className="custom-file">
              <input type="file" className="custom-file-input" id="imgFile"
                     onChange={event => (this.article.picturePath = URL.createObjectURL(event.target.files[0]))}
                     aria-describedby="imgSpan" />
                <label className="custom-file-label" htmlFor="imgFile">Choose a suitable image</label>
            </div>
          </div>
          {/*====== image preview ======*/}
          <div className="card align-items-center p-3 text-center">
            <img src={this.article.picturePath} className="card-img w-25" alt="[ Preview ]"/>
          </div>
          <p></p>{/* shitty hack */}
          <div className="row">
            <label htmlFor="imgAlt" className="col col-form-label">Alt-Text</label>
            <div className="col-11">
              <input id="imgAlt" className="form-control" type="text" placeholder="Image content description" aria-describedby="imgAltHelp"/>
              <small id="imgAltHelp" className="form-text text-muted">An alt-text will let people with bad vision get an idea of what it depicts (or if it does not load)</small>
            </div>
          </div>
          <p></p>{/* shitty hack */}
          <div className="row">
            <label htmlFor="imgCapt" className="col col-form-label">Image Caption</label>
            <div className="col-11">
              <input id="imgCapt" className="form-control"
                     type="text" placeholder="Image caption"
                     onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.article.pictureCapt = event.target.value)}
                     aria-describedby="imgCaptHelp"/>
              <small id="imgCaptHelp" className="form-text text-muted">Please provide a caption for your image, containing further details</small>
            </div>
          </div>
        </div>
        {/*====== markdown text ======*/}
        <div className="form-group">
          <SimpleMDE onChange={this.handleMarkdownChange} label="Main text" options={{spellChecker: false}} />
        </div>
        {/*====== category and tags ======*/}
        <div className="form-row">
          <div className="col-2">
            <label htmlFor="category">Category</label>
            <select className="custom-select" id="category">
              <option selected>Select category...</option>
              <option value="1">Culture</option>
              <option value="2">Politics</option>
              <option value="3">whatever</option>
            </select>
          </div>
          <div className="col-10">
            <label htmlFor="tags">Tags</label>
            <input id="tags" className="form-control" type="text" placeholder="tag1, tag2, tag3..." aria-describedby="tagHelp"/>
            <small id="tagHelp" className="form-text text-muted">Let people find your article by providing specific tags</small>
          </div>
        </div>
        <button type="submit" className="btn btn-primary">Upload</button>
      </form>
        </div>
      </div>
    );
  }

  handleMarkdownChange(value: string) {
    this.article.text = value;
  }
}