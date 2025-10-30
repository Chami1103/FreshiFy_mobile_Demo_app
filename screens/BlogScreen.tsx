import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Loader from '../components/Loader';
import { getBlogPosts } from '../services/apiService';
import { BlogPost } from '../types';

const BlogCard: React.FC<{ post: BlogPost }> = ({ post }) => (
    <Card className="p-0 overflow-hidden">
        <img src={post.imageUrl} alt={post.title} className="w-full h-32 object-cover" />
        <div className="p-4">
            <h2 className="text-lg font-semibold text-yellow-600 dark:text-yellow-300">{post.title}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 mb-3">{post.preview}</p>
            <div className="text-xs text-gray-500 dark:text-gray-400">
                <span>By {post.author}</span> &bull; <span>{post.date}</span>
            </div>
        </div>
    </Card>
);

const BlogScreen: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const postsData = await getBlogPosts();
        setPosts(postsData);
      } catch (err) {
        setError('Failed to load blog posts.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">FreshiFy Blog</h1>
        <p className="text-emerald-600 dark:text-emerald-200">Tips and tricks for a fresher kitchen.</p>
      </div>
      
      {isLoading && <div className="flex justify-center pt-8"><Loader text="Loading posts..." /></div>}
      {error && <Card><p className="text-center text-red-500">{error}</p></Card>}
      
      {!isLoading && !error && (
          <div className="space-y-4">
            {posts.map(post => (
                <BlogCard key={post.id} post={post} />
            ))}
          </div>
      )}
    </div>
  );
};

export default BlogScreen;
