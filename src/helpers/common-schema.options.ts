export const CommonSchemaOptions = {
  timestamps: true,
  versionKey: false,
  toJSON: {
    transform: (doc, ret) => {
      delete ret.password;
      delete ret.__v;
    },
  },
};
