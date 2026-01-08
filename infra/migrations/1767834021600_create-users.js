exports.up = (pgm) => {
  pgm.createTable("users", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    // For reference, GitHub limits usernames to 39 characters.
    username: {
      type: "varchar(30)",
      notNull: true,
      unique: true,
    },
    // The maximum lenght for an email is 254
    email: {
      type: "varchar(254)",
      notNull: true,
      unique: true,
    },
    // Maximum bcrypt output limit is 60 characters
    password: {
      type: "varchar(60)",
      notNull: true,
    },
    // Use timestamp with time-zone
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("timezone('utc', now())"),
    },
    updated_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("timezone('utc', now())"),
    },
  });
};

exports.down = false;
