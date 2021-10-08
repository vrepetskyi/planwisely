CREATE TABLE plans(
    id SERIAL PRIMARY KEY,
    email VARCHAR(320) NOT NULL UNIQUE,
    weeks JSON,
    origin_week_id SMALLINT,
    origin_date DATE
);

///////////////////////////////////

CREATE TABLE templates(
    id SERIAL PRIMARY KEY,
    plan_id INT REFERENCES plans(id) ON DELETE CASCADE,
    name VARCHAR(32) NOT NULL,
    parent_template_id INT REFERENCES templates(id) ON DELETE CASCADE,
    color BYTEA,
    snap_options INT[],
    duration INT
);

CREATE TABLE events(
    id SERIAL PRIMARY KEY,
    plan_id INT REFERENCES plans(id) ON DELETE CASCADE,
    template_id INT REFERENCES templates(id) ON DELETE CASCADE,
    time INT NOT NULL,
    duration INT,
    day INT NOT NULL,
    weeks INT[],
    relative_event_id INT REFERENCES events(id) ON DELETE SET NULL
);

CREATE TABLE info_types(
    id SERIAL PRIMARY KEY,
    plan_id INT REFERENCES plans(id) ON DELETE CASCADE,
    type VARCHAR(32) NOT NULL
);

CREATE TABLE info_values(
    id SERIAL PRIMARY KEY,
    plan_id INT REFERENCES plans(id) ON DELETE CASCADE,
    value VARCHAR(320) NOT NULL,
    info_type_id INT REFERENCES info_types(id) ON DELETE CASCADE
);

CREATE TABLE template_info(
    id SERIAL PRIMARY KEY,
    plan_id INT REFERENCES plans(id) ON DELETE CASCADE,
    template_id INT REFERENCES templates(id) ON DELETE CASCADE,
    info_type_id INT REFERENCES info_types(id) ON DELETE CASCADE,
    info_value_id INT REFERENCES info_values(id) ON DELETE CASCADE
);