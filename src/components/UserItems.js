import React, { useEffect, useState } from 'react';
import Portal from '@arcgis/core/portal/Portal.js';
import esriRequest from "@arcgis/core/request.js";
import PortalQueryParams from '@arcgis/core/portal/PortalQueryParams.js';

const UserItems = ({ userInfo }) => {
    const [items, setItems] = useState([]);
    const [tags, setTags] = useState({});
    const [feedback, setFeedback] = useState('');

    useEffect(() => {
        if (userInfo) {
            const portal = new Portal();
            portal.load().then(() => {
                const queryParams = new PortalQueryParams({
                    query: `owner:${userInfo.username}`,
                    sortField: 'numViews',
                    sortOrder: 'desc',
                    num: 20,
                });

                portal.queryItems(queryParams).then((response) => {
                    setItems(response.results);
                });
            });
        }
    }, [userInfo]);

    const handleTagChange = (itemId, value) => {
        setTags((prevTags) => ({
            ...prevTags,
            [itemId]: value
        }));
    };

    const getItemTags = async (itemId) => {
        const url = `https://www.arcgis.com/sharing/rest/content/items/${itemId}?f=json`;
        try {
            const response = await esriRequest(url, {
                method: "GET",
            });
            return response.data.tags || []; // Return the current tags or an empty array if none exist
        } catch (error) {
            setFeedback(`Error fetching tags: ${error.message}`);
            return []; // Return an empty array in case of error
        }
    };

    const addTagsToItem = async (itemId, tags, token) => {
        const url = `https://www.arcgis.com/sharing/rest/content/users/${userInfo.username}/items/${itemId}/update`;
        const params = new URLSearchParams({
            tags: tags.join(','),
            f: 'json',
            token: token
        }).toString();

        try {
            const response = await esriRequest(url, {
                method: "POST",
                body: params,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });
            setFeedback('Tag added successfully!');
            return response.data;
        } catch (error) {
            setFeedback(`Error adding tag: ${error.message}`);
            throw error;
        }
    };

    const addTag = async (itemId) => {
        const newTag = tags[itemId]?.trim();
        if (!newTag) {
            setFeedback('Tag cannot be empty.');
            return;
        }

        const currentTags = await getItemTags(itemId);
        const newTags = [...currentTags, newTag.split(',').map(tag => tag.trim()).filter(tag => tag)];

        try {
            await addTagsToItem(itemId, newTags, userInfo.token);
            // Clear the input field after successful submission
            setTags((prevTags) => ({
                ...prevTags,
                [itemId]: '' // Reset the input for the specific item
            }));
        } catch (err) {
            setFeedback(`Error adding tag: ${err.message}`);
        }
    };

    const handleKeyDown = (event, itemId) => {
        if (event.key === 'Enter') {
            addTag(itemId);
        }
    };

    return (
        <div className='user-items'>
            <h2>Your Items</h2>
            {userInfo ? (
                <div>
                    {items.map(item => (
                        <div className='user-item' key={item.id}>
                            <h3>{item.title}</h3>
                            <input
                                type="text"
                                className='tag-input'
                                value={tags[item.id] || ''}
                                onChange={(e) => handleTagChange(item.id, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, item.id)}
                                placeholder="Add a tag"
                            />
                            <button className='add-tag-button' onClick={() => addTag(item.id)}>Add</button>
                            <label className='label-hint'>*More tags are separated by commas*</label>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Please log in to see your items.</p>
            )}
            {feedback && (
                <div className={`feedback-message ${feedback.includes('Error') ? 'error' : 'success'}`}>
                    {feedback}
                </div>
            )}
        </div>
    );
};

export default UserItems;