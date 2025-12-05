import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ApisResponseDocument extends Document {
  bcv: {
    usd: number;
    eur: number;
    source: string;
    lastUpdateUsd: string | null;
    lastUpdateEur: string | null;
  };
  binance: {
    asset: string;
    fiat: string;
    price: number;
    source: string;
  };
  updatedAt: Date;
}

const ApisResponseSchema = new Schema<ApisResponseDocument>(
  {
    bcv: {
      usd: { type: Number, required: true },
      eur: { type: Number, required: true },
      source: { type: String, required: true },
      lastUpdateUsd: { type: String, default: null },
      lastUpdateEur: { type: String, default: null },
    },
    binance: {
      asset: { type: String, required: true },
      fiat: { type: String, required: true },
      price: { type: Number, required: true },
      source: { type: String, required: true },
    },
    updatedAt: {
      type: Date,
      required: true,
      default: () => new Date(),
    },
  },
  {
    collection: 'apis_response',
  }
);

export const ApisResponseModel: Model<ApisResponseDocument> =
  mongoose.models.ApisResponse ||
  mongoose.model<ApisResponseDocument>('ApisResponse', ApisResponseSchema);
