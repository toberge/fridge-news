// @flow

export default class Comment {
  articleID: number;
  authorID: number;
  text: string;
  uploadTime: Date;
  updateTime: Date | null;

  constructor(articleID: number, authorID: number, text: string, uploadTime: Date, updateTime: Date | null) {
    this.articleID = articleID;
    this.authorID = authorID;
    this.text = text;
    this.uploadTime = uploadTime;
    this.updateTime = updateTime;
  }
}
