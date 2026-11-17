import { pgTable, integer, varchar, index, foreignKey, uuid, text, jsonb, timestamp, uniqueIndex, vector, boolean, real, numeric, pgView } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const spatialRefSys = pgTable("spatial_ref_sys", {
	srid: integer().notNull(),
	authName: varchar("auth_name", { length: 256 }),
	authSrid: integer("auth_srid"),
	srtext: varchar({ length: 2048 }),
	proj4Text: varchar({ length: 2048 }),
});

export const mutSaPosts = pgTable("mut_sa_posts", {
	id: uuid().notNull(),
	authorId: uuid("author_id").notNull(),
	communityId: uuid("community_id"),
	body: text().notNull(),
	mediaType: text("media_type").notNull(),
	mediaUrls: jsonb("media_urls").notNull(),
	likeCount: integer("like_count").notNull(),
	commentCount: integer("comment_count").notNull(),
	repostCount: integer("repost_count").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("mut_sa_posts_community_feed_idx").using("btree", table.communityId.asc().nullsLast().op("timestamptz_ops"), table.createdAt.asc().nullsLast().op("uuid_ops"), table.id.asc().nullsLast().op("uuid_ops")),
	index("mut_sa_posts_feed_idx").using("btree", table.createdAt.asc().nullsLast().op("uuid_ops"), table.id.asc().nullsLast().op("timestamptz_ops")),
	foreignKey({
			columns: [table.authorId],
			foreignColumns: [mutSaUsers.id],
			name: "mut_sa_posts_author_id_mut_sa_users_id_fk"
		}),
	foreignKey({
			columns: [table.communityId],
			foreignColumns: [mutSaCommunities.id],
			name: "mut_sa_posts_community_id_mut_sa_communities_id_fk"
		}),
]);

export const mutSaProfiles = pgTable("mut_sa_profiles", {
	userId: uuid("user_id").notNull(),
	username: text().notNull(),
	bio: text(),
	avatarUrl: text("avatar_url"),
	bannerUrl: text("banner_url"),
	followersCount: integer("followers_count").notNull(),
	followingCount: integer("following_count").notNull(),
}, (table) => [
	uniqueIndex("mut_sa_profiles_username_idx").using("btree", table.username.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [mutSaUsers.id],
			name: "mut_sa_profiles_user_id_mut_sa_users_id_fk"
		}).onDelete("cascade"),
]);

export const mutSaUsers = pgTable("mut_sa_users", {
	id: uuid().notNull(),
	email: text().notNull(),
	emailVerifiedAt: timestamp("email_verified_at", { withTimezone: true, mode: 'string' }),
	displayName: text("display_name").notNull(),
	role: varchar({ length: 16 }).notNull(),
	passwordHash: text("password_hash"),
	regNo: text("reg_no"),
	schoolId: uuid("school_id"),
	courseId: uuid("course_id"),
	yearGroupId: uuid("year_group_id"),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
	deleteRequestedAt: timestamp("delete_requested_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).notNull(),
}, (table) => [
	uniqueIndex("mut_sa_users_email_idx").using("btree", table.email.asc().nullsLast().op("text_ops")),
	uniqueIndex("mut_sa_users_reg_no_idx").using("btree", table.regNo.asc().nullsLast().op("text_ops")),
]);

export const mutSaCommunities = pgTable("mut_sa_communities", {
	id: uuid().notNull(),
	parentId: uuid("parent_id"),
	type: text().notNull(),
	name: text().notNull(),
	slug: text().notNull(),
	description: text(),
	coverImageUrl: text("cover_image_url"),
	iconUrl: text("icon_url"),
	createdBy: uuid("created_by"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).notNull(),
}, (table) => [
	index("mut_sa_communities_parent_idx").using("btree", table.parentId.asc().nullsLast().op("uuid_ops")),
	uniqueIndex("mut_sa_communities_slug_idx").using("btree", table.slug.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [mutSaUsers.id],
			name: "mut_sa_communities_created_by_mut_sa_users_id_fk"
		}),
]);

export const mutSaDocuments = pgTable("mut_sa_documents", {
	id: uuid().notNull(),
	title: text().notNull(),
	sourceUrl: text("source_url"),
	content: text().notNull(),
	embedding: vector({ dimensions: 768 }),
	schoolId: uuid("school_id"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.schoolId],
			foreignColumns: [mutSaCommunities.id],
			name: "mut_sa_documents_school_id_mut_sa_communities_id_fk"
		}),
]);

export const mutSaReports = pgTable("mut_sa_reports", {
	id: uuid().notNull(),
	reporterId: uuid("reporter_id"),
	anonymous: boolean().notNull(),
	entityType: text("entity_type").notNull(),
	entityId: uuid("entity_id").notNull(),
	category: text().notNull(),
	details: text(),
	status: text().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).notNull(),
	resolvedAt: timestamp("resolved_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("mut_sa_reports_queue_idx").using("btree", table.status.asc().nullsLast().op("text_ops"), table.createdAt.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.reporterId],
			foreignColumns: [mutSaUsers.id],
			name: "mut_sa_reports_reporter_id_mut_sa_users_id_fk"
		}).onDelete("set null"),
]);

export const mutSaTimelineEntries = pgTable("mut_sa_timeline_entries", {
	userId: uuid("user_id").notNull(),
	postId: uuid("post_id").notNull(),
	score: real().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).notNull(),
}, (table) => [
	index("mut_sa_timeline_feed_idx").using("btree", table.userId.asc().nullsLast().op("timestamptz_ops"), table.score.asc().nullsLast().op("timestamptz_ops"), table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [mutSaUsers.id],
			name: "mut_sa_timeline_entries_user_id_mut_sa_users_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.postId],
			foreignColumns: [mutSaPosts.id],
			name: "mut_sa_timeline_entries_post_id_mut_sa_posts_id_fk"
		}).onDelete("cascade"),
]);

export const mutSaMarketplaceListings = pgTable("mut_sa_marketplace_listings", {
	id: uuid().notNull(),
	sellerId: uuid("seller_id").notNull(),
	title: text().notNull(),
	description: text().notNull(),
	priceKes: numeric("price_kes", { precision: 12, scale:  2 }).notNull(),
	category: text().notNull(),
	imageUrls: jsonb("image_urls").notNull(),
	// TODO: failed to parse database type 'geography(Point,4326)'
	location: unknown("location"),
	campusZone: text("campus_zone"),
	verifiedSeller: boolean("verified_seller").notNull(),
	status: text().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).notNull(),
}, (table) => [
	index("mut_sa_listings_geo_idx").using("gist", table.location.asc().nullsLast().op("gist_geography_ops")),
	foreignKey({
			columns: [table.sellerId],
			foreignColumns: [mutSaUsers.id],
			name: "mut_sa_marketplace_listings_seller_id_fkey"
		}),
]);
export const geographyColumns = pgView("geography_columns", {	// TODO: failed to parse database type 'name'
	fTableCatalog: unknown("f_table_catalog"),
	// TODO: failed to parse database type 'name'
	fTableSchema: unknown("f_table_schema"),
	// TODO: failed to parse database type 'name'
	fTableName: unknown("f_table_name"),
	// TODO: failed to parse database type 'name'
	fGeographyColumn: unknown("f_geography_column"),
	coordDimension: integer("coord_dimension"),
	srid: integer(),
	type: text(),
}).as(sql`SELECT current_database() AS f_table_catalog, n.nspname AS f_table_schema, c.relname AS f_table_name, a.attname AS f_geography_column, postgis_typmod_dims(a.atttypmod) AS coord_dimension, postgis_typmod_srid(a.atttypmod) AS srid, postgis_typmod_type(a.atttypmod) AS type FROM pg_class c, pg_attribute a, pg_type t, pg_namespace n WHERE t.typname = 'geography'::name AND a.attisdropped = false AND a.atttypid = t.oid AND a.attrelid = c.oid AND c.relnamespace = n.oid AND (c.relkind = ANY (ARRAY['r'::"char", 'v'::"char", 'm'::"char", 'f'::"char", 'p'::"char"])) AND NOT pg_is_other_temp_schema(c.relnamespace) AND has_table_privilege(c.oid, 'SELECT'::text)`);

export const geometryColumns = pgView("geometry_columns", {	fTableCatalog: varchar("f_table_catalog", { length: 256 }),
	// TODO: failed to parse database type 'name'
	fTableSchema: unknown("f_table_schema"),
	// TODO: failed to parse database type 'name'
	fTableName: unknown("f_table_name"),
	// TODO: failed to parse database type 'name'
	fGeometryColumn: unknown("f_geometry_column"),
	coordDimension: integer("coord_dimension"),
	srid: integer(),
	type: varchar({ length: 30 }),
}).as(sql`SELECT current_database()::character varying(256) AS f_table_catalog, n.nspname AS f_table_schema, c.relname AS f_table_name, a.attname AS f_geometry_column, COALESCE(postgis_typmod_dims(a.atttypmod), sn.ndims, 2) AS coord_dimension, COALESCE(NULLIF(postgis_typmod_srid(a.atttypmod), 0), sr.srid, 0) AS srid, replace(replace(COALESCE(NULLIF(upper(postgis_typmod_type(a.atttypmod)), 'GEOMETRY'::text), st.type, 'GEOMETRY'::text), 'ZM'::text, ''::text), 'Z'::text, ''::text)::character varying(30) AS type FROM pg_class c JOIN pg_attribute a ON a.attrelid = c.oid AND NOT a.attisdropped JOIN pg_namespace n ON c.relnamespace = n.oid JOIN pg_type t ON a.atttypid = t.oid LEFT JOIN ( SELECT s.connamespace, s.conrelid, s.conkey, (regexp_match(s.consrc, 'geometrytype\(\w+\)\s*=\s*''(\w+)'''::text, 'i'::text))[1] AS type FROM ( SELECT pg_constraint.connamespace, pg_constraint.conrelid, pg_constraint.conkey, pg_get_constraintdef(pg_constraint.oid) AS consrc FROM pg_constraint) s WHERE s.consrc ~* 'geometrytype\(\w+\)\s*=\s*''\w+'''::text) st ON st.connamespace = n.oid AND st.conrelid = c.oid AND (a.attnum = ANY (st.conkey)) LEFT JOIN ( SELECT s.connamespace, s.conrelid, s.conkey, (regexp_match(s.consrc, 'ndims\(\w+\)\s*=\s*(\d+)'::text, 'i'::text))[1]::integer AS ndims FROM ( SELECT pg_constraint.connamespace, pg_constraint.conrelid, pg_constraint.conkey, pg_get_constraintdef(pg_constraint.oid) AS consrc FROM pg_constraint) s WHERE s.consrc ~* 'ndims\(\w+\)\s*=\s*\d+'::text) sn ON sn.connamespace = n.oid AND sn.conrelid = c.oid AND (a.attnum = ANY (sn.conkey)) LEFT JOIN ( SELECT s.connamespace, s.conrelid, s.conkey, (regexp_match(s.consrc, 'srid\(\w+\)\s*=\s*(\d+)'::text, 'i'::text))[1]::integer AS srid FROM ( SELECT pg_constraint.connamespace, pg_constraint.conrelid, pg_constraint.conkey, pg_get_constraintdef(pg_constraint.oid) AS consrc FROM pg_constraint) s WHERE s.consrc ~* 'srid\(\w+\)\s*=\s*\d+'::text) sr ON sr.connamespace = n.oid AND sr.conrelid = c.oid AND (a.attnum = ANY (sr.conkey)) WHERE (c.relkind = ANY (ARRAY['r'::"char", 'v'::"char", 'm'::"char", 'f'::"char", 'p'::"char"])) AND NOT c.relname = 'raster_columns'::name AND t.typname = 'geometry'::name AND NOT pg_is_other_temp_schema(c.relnamespace) AND has_table_privilege(c.oid, 'SELECT'::text)`);