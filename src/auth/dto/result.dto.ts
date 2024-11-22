import { Types } from 'mongoose';

export type getArtistsInLabel = {
  _id: Types.ObjectId;
  artists: Types.ObjectId[];
};

export type getlabelsInArtist = {
  _id: Types.ObjectId;
  labels: Types.ObjectId[];
};

export type getLabelsInChannel = {
  _id: Types.ObjectId;
  channelRefId: string;
  labels: Types.ObjectId[];
};

export type getArtistsInChannel = {
  _id: Types.ObjectId;
  channelRefId: string;
  artists: Types.ObjectId[];
};
