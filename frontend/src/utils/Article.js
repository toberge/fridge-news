// @flow

export class ArticleBase {
  id: number;
  title: string;
  picturePath: ?string;
  pictureAlt: ?string;
  category: string;

  constructor(id: number, title: string, picturePath: string, pictureAlt: string, category: string) {
    this.id = id;
    this.title = title;
    this.picturePath = picturePath;
    this.pictureAlt = pictureAlt;
    this.category = category;
  }
}

export class Article {
  id: number;
  authorID: number;
  title: string;
  picturePath: string | null;
  pictureAlt: string | null;
  pictureCapt: string | null;
  text: string;
  category: string;
  uploadTime: Date;
  updateTime: Date | null;
  importance: 1 | 2;
  rating: number;

  constructor(
    id: number,
    authorID: number,
    title: string,
    picturePath: string | null,
    pictureAlt: string | null,
    pictureCapt: string | null,
    text: string,
    category: string,
    uploadTime: Date,
    updateTime: Date | null,
    importance: 1 | 2,
    rating: number
  ) {
    this.id = id;
    this.authorID = authorID;
    this.title = title;
    this.picturePath = picturePath;
    this.pictureAlt = pictureAlt;
    this.pictureCapt = pictureCapt;
    this.text = text;
    this.category = category;
    this.uploadTime = uploadTime;
    this.updateTime = updateTime;
    this.importance = importance;
    this.rating = rating;
  }
}
