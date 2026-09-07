import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import ProfileTop from './ProfileTop';
import ProfileAbout from './ProfileAbout';
import ProfileExperience from './ProfileExperience';
import ProfileEducation from './ProfileEducation';
import ProfileGithub from './ProfileGithub';
import { getProfileById } from '../../actions/profile';

const Profile = ({ getProfileById, profile: { profile, loading }, auth }) => {
    const { id } = useParams();

    useEffect(() => {
        getProfileById(id);
    }, [getProfileById, id]);

    return (
        <Fragment>
            {profile === null || loading ? <Spinner /> : <Fragment>
                <Link to='/profiles' className='btn btn-light'>
                    Back to profiles
                </Link>
                {auth.isAuthenticated && auth.loading === false && auth.user._id === profile.user._id && (
                    <Link to='/edit-profile' className='btn btn-dark'>
                        Edit profile
                    </Link>
                )}
                <div className="profile-grid my-1">
                    <ProfileTop profile={profile} />
                    <ProfileAbout profile={profile} />
                    <div className="profile-exp bg-white p-2">
                        <h2 className="text-primary">Experience</h2>
                        {profile.experience.length > 0 ? (
                            <Fragment>
                                {profile.experience.map(experience => (
                                    <ProfileExperience
                                        key={experience._id}
                                        experience={experience} 
                                    />
                                ))}
                            </Fragment>
                        ) : (
                            <Fragment>
                                <h3>Experience</h3>
                                <p>No experience</p>
                            </Fragment>
                        )}
                    </div>

                    <div className="profile-edu bg-white p-2">
                        <h2 className="text-primary">Education</h2>
                        {profile.education.length > 0 ? (
                            <Fragment>
                                {profile.education.map(education => (
                                    <ProfileEducation
                                        key={education._id}
                                        education={education} 
                                    />
                                ))}
                            </Fragment>
                        ) : (
                            <Fragment>
                                <h3>Education</h3>
                                <p>No education credentials</p>
                            </Fragment>
                        )}
                    </div>

                    {profile.githubusername && (
                        <ProfileGithub username={profile.githubusername} />
                    )}
                </div>
            </Fragment>}
        </Fragment>
    );
};


Profile.propTypes = {
    profile: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    getProfileById: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    profile: state.profile,
    auth: state.auth,
});

export default connect(mapStateToProps, { getProfileById })(Profile);
