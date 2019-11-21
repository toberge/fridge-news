// @flow

export default class Comment {
  id: number;
  articleID: number;
  authorID: number;
  text: string;
  uploadTime: Date;
  updateTime: Date | null;

  constructor(id: number, articleID: number, authorID: number, text: string, uploadTime: Date, updateTime: Date | null) {
    this.id = id;
    this.articleID = articleID;
    this.authorID = authorID;
    this.text = text;
    this.uploadTime = uploadTime;
    this.updateTime = updateTime;
  }
}
