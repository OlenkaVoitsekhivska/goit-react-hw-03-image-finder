import React, { Component } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Loader from './Loader/Loader';
import Button from './Button/Button';

export default class App extends Component {
  state = {
    API_KEY: '25705868-b120ad61381773d51dfa3e39d',
    API_URL: 'https://pixabay.com/api/',
    query: '',
    pics: [],
    page: 1,
    status: 'idle',
    error: '',
    totalHits: null,
  };

  fetchApi = () => {
    return fetch(
      `${this.state.API_URL}?q=${this.state.query}&page=${this.state.page}&key=${this.state.API_KEY}&image_type=photo&orientation=horizontal&per_page=12`
    )
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        return Promise.reject(new Error('Failed to find any images'));
      })
      .then(pics => {
        if (!pics.total) {
          toast.error('Did find anything, mate');
        }
        const selectedProperties = pics.hits.map(
          ({ id, largeImageURL, webformatURL }) => {
            return { id, largeImageURL, webformatURL };
          }
        );
        this.setState(prevState => {
          return {
            pics: [...prevState.pics, ...selectedProperties],
            status: 'resolved',
            totalHits: pics.total,
          };
        });
      })
      .catch(error => this.setState({ error, status: 'rejected' }));
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.state.query !== prevState.query) {
      this.setState({ status: 'pending', pics: [], page: 1 });
      this.fetchApi();
    }
    if (
      this.state.query === prevState.query &&
      this.state.page !== prevState.page
    ) {
      this.setState({ status: 'pending' });
      this.fetchApi();
    }
  }

  processSubmit = query => {
    this.setState({ query });
  };

  handleLoadMore = () => {
    this.setState(prevState => {
      return { page: prevState.page + 1 };
    });
  };

  render() {
    const { pics, status, totalHits } = this.state;
    return (
      <>
        <Searchbar onSubmit={this.processSubmit} />
        {pics.length && <ImageGallery images={pics} />}
        {totalHits > pics.length && <Button onClick={this.handleLoadMore} />}
        {status === 'pending' && <Loader />}
        <ToastContainer autoClose={2000} />
      </>
    );
  }
}
