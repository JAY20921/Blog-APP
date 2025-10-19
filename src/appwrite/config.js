import conf from '../conf/conf';
import { Client, ID, Databases, Storage, Query } from "appwrite";

export class Service {
    client = new Client();
    databases;
    bucket;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    // ✅ Create a new post
    async createPost({ title, slug, content, featuredImage, status, userId }) {
    try {
        return await this.databases.createDocument(
            conf.appwriteDatabaseId,
            conf.appwriteCollectionId,
            ID.unique(), // unique ID instead of slug
            {
                title,
                content,
                image: featuredImage || "",
                status,
                userid: userId, // ✅ must match Appwrite field exactly
            }
        );
    } catch (error) {
        console.log("Appwrite service :: createPost :: error", error);
        throw error; // optional: helps debugging
    }
}


    // ✅ Update existing post
    async updatePost(slug, { title, content, featuredImage, status }) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    image: featuredImage || "",
                    status,
                }
            );
        } catch (error) {
            console.log("Appwrite service :: updatePost :: error", error);
        }
    }

    // ✅ Delete a post
    async deletePost(slug) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            );
            return true;
        } catch (error) {
            console.log("Appwrite service :: deletePost :: error", error);
            return false;
        }
    }

    // ✅ Get a single post
    async getPost(slug) {
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            );
        } catch (error) {
            console.log("Appwrite service :: getPost :: error", error);
            return false;
        }
    }

    // ✅ Get all posts (active only)
    async getPosts(queries = [Query.equal("status", "active")]) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                queries
            );
        } catch (error) {
            console.log("Appwrite service :: getPosts :: error", error);
            return false;
        }
    }

    // ✅ Upload a file
    async uploadFile(file) {
        try {
            return await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file
            );
        } catch (error) {
            console.log("Appwrite service :: uploadFile :: error", error);
            return false;
        }
    }

    // ✅ Delete a file
    async deleteFile(fileId) {
        try {
            await this.bucket.deleteFile(
                conf.appwriteBucketId,
                fileId
            );
            return true;
        } catch (error) {
            console.log("Appwrite service :: deleteFile :: error", error);
            return false;
        }
    }

    // ✅ Get file preview URL (works on free Appwrite plan)
    getFileUrl(fileId) {
        return `${conf.appwriteUrl}/storage/buckets/${conf.appwriteBucketId}/files/${fileId}/view?project=${conf.appwriteProjectId}`;
    }

    // ✅ Alias for compatibility (fixes "getFileView is not a function" error)
    getFileView(fileId) {
        return this.getFileUrl(fileId);
    }

    async likePost(postId) {
        try {
            const post = await this.getPost(postId);
            const currentLikes = post.likes || 0;

            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                postId,
                {
                    likes: currentLikes + 1,
                }
            );
        } catch (error) {
            console.log("Appwrite service :: likePost :: error", error);
            return false;
        }
    }

    // Decrement likes for a post
    async unlikePost(postId) {
        try {
            const post = await this.getPost(postId);
            const currentLikes = post.likes || 0;

            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                postId,
                {
                    likes: Math.max(currentLikes - 1, 0),
                }
            );
        } catch (error) {
            console.log("Appwrite service :: unlikePost :: error", error);
            return false;
        }
    }

    
}


const service = new Service();
export default service;
