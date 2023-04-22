import ImageUpload from "../ImageUpload/ImageUpload";
import Post from "../Post/Post";
import React, {useEffect, useState} from 'react';
import SearchBar from "../SearchBar/SearchBar";
import {db} from "../firebase";

const PostList = ({filteredPosts, user, username, setSearch}) => {

    return(
                <div className='app__postsLeft'>
                    <div>
                        <p className="h2">What's up {user.displayName}!</p>
                    </div>
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