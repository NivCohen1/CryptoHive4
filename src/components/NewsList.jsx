import React from 'react';

const NewsList = ({ news, loading, error }) => {
    if (loading) {
        return <div className="loading-spinner"><div className="spinner"></div></div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="news-grid">
            {news.map((article, index) => (
                <article key={index} className="news-card">
                    <img src={article.imageurl || "/api/placeholder/400/200"} alt={article.title} className="news-image" />
                    <div className="news-content">
                        <h3 className="news-title">{article.title}</h3>
                        <p className="news-description">{article.body.substring(0, 150)}...</p>
                        <div className="news-footer">
                            <span className="news-date">{new Date(article.published_on * 1000).toLocaleDateString()}</span>
                            <a href={article.url} target="_blank" rel="noopener noreferrer" className="read-more">Read More</a>
                        </div>
                    </div>
                </article>
            ))}
        </div>
    );
};

export default NewsList;
