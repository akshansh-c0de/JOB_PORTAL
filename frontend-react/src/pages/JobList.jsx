import React, { useState, useEffect } from 'react';
import api from '../api.js';

const JobList = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async (keyword = '') => {
        try {
            const res = await api.get(`/jobs/jobs?keyword=${keyword}`);
            setJobs(res.data.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching jobs', err);
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchJobs(search);
    };

    const handleApply = async (jobId) => {
        if (!token) {
            alert('Please login to apply');
            return;
        }
        
        try {
            const resumeLink = prompt('Enter your Resume Link or Portfolio URL:');
            if(!resumeLink) return;

            // Note: Authorization header is now automatically added by our api.js interceptor!
            await api.post(`/applications/apply/${jobId}`, { resume: resumeLink });
            alert('Congratulations! Your application has been submitted successfully.');
        } catch (err) {
            alert(err.response?.data?.message || 'Something went wrong during application.');
        }
    };

    return (
        <div className="container">
            <section className="hero fade-in">
                <h1>Find your dream job <br/> in the tech industry</h1>
                <p>Discover thousands of job opportunities from top-tier companies and take your career to the next level.</p>
                
                <form onSubmit={handleSearch} style={{ maxWidth: '600px', margin: '40px auto', display: 'flex', gap: '12px' }}>
                    <input 
                        type="text" 
                        placeholder="Search by job title (e.g. Developer, Designer)..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ margin: 0 }}
                    />
                    <button type="submit" className="btn btn-primary">Search</button>
                </form>
            </section>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <div className="loader">Loading amazing opportunities...</div>
                </div>
            ) : (
                <div className="job-grid fade-in">
                    {jobs.map((job) => (
                        <div key={job._id} className="card">
                            <div className="job-header">
                                <div>
                                    <h3 className="job-title">{job.title}</h3>
                                    <div className="company-name">{job.company}</div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                                    <span className="badge badge-location">{job.location}</span>
                                    <span className="badge badge-salary">₹{job.salary.toLocaleString()}/yr</span>
                                </div>
                            </div>
                            <p className="job-description">
                                {job.description.length > 120 ? job.description.substring(0, 120) + '...' : job.description}
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                    Posted by <strong>{job.createdBy?.name || 'Top Recruiter'}</strong>
                                </span>
                                {(!user || user.role === 'candidate') && (
                                    <button onClick={() => handleApply(job._id)} className="btn btn-primary">
                                        Apply Now
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    {jobs.length === 0 && (
                        <div style={{ textAlign: 'center', gridColumn: '1/-1', padding: '60px' }}>
                            <h3 style={{ color: 'var(--text-muted)' }}>No jobs found matching your search.</h3>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default JobList;
