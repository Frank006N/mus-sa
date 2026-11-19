export default function PostCard({ post }: { post: any }) {
  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h3 className="font-bold">{post.title || 'Post'}</h3>
      <p className="text-gray-600">{post.content || 'Content loading...'}</p>
    </div>
  );
}
