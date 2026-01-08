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
    // Maximum bcrypt limit is 72 characters
    password: {
      type: "varchar(72)",
      notNull: true,
    },
    // Use timestamp with time-zone
    created_at: {
      type: "timestamptz",
      default: pgm.func("now()"),
    },
    updated_at: {
      type: "timestamptz",
      default: pgm.func("now()"),
    },
  });
};

exports.down = false;
