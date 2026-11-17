import { relations } from "drizzle-orm/relations";
import { mutSaUsers, mutSaPosts, mutSaCommunities, mutSaProfiles, mutSaDocuments, mutSaReports, mutSaTimelineEntries, mutSaMarketplaceListings } from "./schema";

export const mutSaPostsRelations = relations(mutSaPosts, ({one, many}) => ({
	mutSaUser: one(mutSaUsers, {
		fields: [mutSaPosts.authorId],
		references: [mutSaUsers.id]
	}),
	mutSaCommunity: one(mutSaCommunities, {
		fields: [mutSaPosts.communityId],
		references: [mutSaCommunities.id]
	}),
	mutSaTimelineEntries: many(mutSaTimelineEntries),
}));

export const mutSaUsersRelations = relations(mutSaUsers, ({many}) => ({
	mutSaPosts: many(mutSaPosts),
	mutSaProfiles: many(mutSaProfiles),
	mutSaCommunities: many(mutSaCommunities),
	mutSaReports: many(mutSaReports),
	mutSaTimelineEntries: many(mutSaTimelineEntries),
	mutSaMarketplaceListings: many(mutSaMarketplaceListings),
}));

export const mutSaCommunitiesRelations = relations(mutSaCommunities, ({one, many}) => ({
	mutSaPosts: many(mutSaPosts),
	mutSaUser: one(mutSaUsers, {
		fields: [mutSaCommunities.createdBy],
		references: [mutSaUsers.id]
	}),
	mutSaDocuments: many(mutSaDocuments),
}));

export const mutSaProfilesRelations = relations(mutSaProfiles, ({one}) => ({
	mutSaUser: one(mutSaUsers, {
		fields: [mutSaProfiles.userId],
		references: [mutSaUsers.id]
	}),
}));

export const mutSaDocumentsRelations = relations(mutSaDocuments, ({one}) => ({
	mutSaCommunity: one(mutSaCommunities, {
		fields: [mutSaDocuments.schoolId],
		references: [mutSaCommunities.id]
	}),
}));

export const mutSaReportsRelations = relations(mutSaReports, ({one}) => ({
	mutSaUser: one(mutSaUsers, {
		fields: [mutSaReports.reporterId],
		references: [mutSaUsers.id]
	}),
}));

export const mutSaTimelineEntriesRelations = relations(mutSaTimelineEntries, ({one}) => ({
	mutSaUser: one(mutSaUsers, {
		fields: [mutSaTimelineEntries.userId],
		references: [mutSaUsers.id]
	}),
	mutSaPost: one(mutSaPosts, {
		fields: [mutSaTimelineEntries.postId],
		references: [mutSaPosts.id]
	}),
}));

export const mutSaMarketplaceListingsRelations = relations(mutSaMarketplaceListings, ({one}) => ({
	mutSaUser: one(mutSaUsers, {
		fields: [mutSaMarketplaceListings.sellerId],
		references: [mutSaUsers.id]
	}),
}));