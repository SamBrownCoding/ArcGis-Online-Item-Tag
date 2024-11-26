import React, { useEffect, useState } from 'react';
import Portal from '@arcgis/core/portal/Portal.js';
import PortalQueryParams from '@arcgis/core/portal/PortalQueryParams.js';

const UserItems = ({ userInfo }) => {
    const [items, setItems] = useState([]);
    const [tag, setTag] = useState('');
    const [feedback, setFeedback] = useState('');

    useEffect(() => {
        // Only run this effect if userInfo is not null
        if (userInfo) {
            const portal = new Portal();
            portal.load().then(() => {
                const queryParams = new PortalQueryParams({
                    query: `owner:${userInfo.username}`, // Access username safely
                    sortField: 'numViews',
                    sortOrder: 'desc',
                    num: 20,
                });

                portal.queryItems(queryParams).then((response) => {
                    setItems(response.results);
                });
            });
        }
    }, [userInfo]); // Dependency on userInfo

    const addTag = (itemId) => {
        const portal = new Portal();
        portal.load().then(() => {
            const item = portal.getItem(itemId); // Get the item by ID
            if (item) {
                item.update({ tags: [...item.tags, tag] })
                    .then(() => {
                        setFeedback('Tag added successfully!');
                        setTag(''); // Clear the input field
                    })
                    .catch((err) => {
                        setFeedback(`Error adding tag: ${err.message}`);
                    });
            } else {
                setFeedback('Item not found');
            }
        });
    };

    return (
        <div className='user-items'>
            <h2>Your Items</h2>
            {userInfo ? ( // Conditional rendering
                <div>
                    {items.map(item => (
                        <div className='user-item' key={item.id}>
                            <h3>{item.title}</h3>
                            <input
                                type="text"
                                className='tag-input'
                                value={tag}
                                onChange={(e) => setTag(e.target.value)}
                                placeholder="Add a tag"
                            />
                            <button className='add-tag-button' onClick={() => addTag(item.id)}>Add</button>
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