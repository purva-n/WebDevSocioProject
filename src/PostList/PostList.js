import ImageUpload from "../ImageUpload/ImageUpload";
import Post from "../Post/Post";
import React, {useEffect, useState} from 'react';
import SearchBar from "../SearchBar/SearchBar";
import {db} from "../firebase";

const PostList = ({filteredposts, user, username, postList}) => {
    const [search, setSearch] = useState('');
    const [posts, setPosts] = useState(postList);
    const [filteredPosts, setFilteredPosts] = useState(filteredposts);
    useEffect(() => {
        db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
            console.log(snapshot);
            setPosts(snapshot.docs.map(doc => ({
                id: doc.id,
                post: doc.data()
            })));
        });

        setFilteredPosts(posts.filter((post) =>
            post.post.username.toLowerCase().includes(search.toLowerCase()) ||
            post.post.caption.toLowerCase().includes(search.toLowerCase())
        ));
        //console.log('Your value: ' + filteredPosts.length);
    }, [search, posts]);

    return(
                <div className='app__postsLeft'>
                    <SearchBar setSearch={setSearch} />
                    <ImageUpload username={user.displayName}/>
                    {
                        filteredPosts && filteredPosts.map(({id, post}) =>(
                            <Post key={id} postId={id} user={user} username={username} postusername={post.username}
                                  caption={post.caption} imageUrl={post.imageUrl} fileName={post.fileName}/>
                        ))
                    }
                </div>
            );
}

export default PostList;