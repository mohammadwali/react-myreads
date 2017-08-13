import React, {Component} from 'react';
import {Link} from 'react-router-dom'
import PropTypes from 'prop-types';
import {debounce, find, isEmpty, isArray} from 'underscore';
import BookComponent from './BookComponent';

import * as BooksAPI from './BooksAPI'


class SearchComponent extends Component {

    static propTypes = {
        myBooks: PropTypes.array.isRequired,
        onShelfChange: PropTypes.func.isRequired
    };

    state = {
        searchQuery: '',
        searchedBooks: [],
        noResults: false,
        isLoading: false,
        isInitial: true
    };


    updateQuery(event) {
        // event.persist() permits to avoid putting back the event in the pool.
        // see https://stackoverflow.com/a/28046731/2940233
        event.persist();

        const query = event.target.value;

        this.setState({
            searchQuery: query
        });

        if (!isEmpty(query)) {
            this.searchBooks(query);
        }
        else {

            this.setState({
                isInitial: true
            });
        }
    }

    searchBooks = debounce((query) => {

        this.setState({
            isLoading: true,
            isInitial: false
        });

        BooksAPI
            .search(query)
            .then((books) => {

                if (isArray(books) && books.length) {
                    this.setState((previousState) => {
                        let updatedBooks = books.map((book) => {
                            let mineBook = find(this.props.myBooks, {id: book.id});

                            if (mineBook) {
                                book.shelf = mineBook.shelf;
                            }

                            return book;
                        });


                        return {
                            searchedBooks: updatedBooks,
                            noResults: false,
                            isLoading: false
                        };
                    })
                } else {


                    this.setState({
                        noResults: true,
                        isLoading: false
                    })


                }

            });


    }, 500);


    isMine(bookId) {
        return !!find(this.props.myBooks, {id: bookId});
    }

    render() {
        const {searchQuery: query, searchedBooks: books, isInitial, noResults, isLoading} = this.state;
        const {onShelfChange} = this.props;

        return (
            <div>
                <div className="search-books-bar">
                    <Link className="close-search" to="/">Close</Link>
                    <div className="search-books-input-wrapper">

                        <input type="text" value={query}
                               onChange={(e) => this.updateQuery(e)}
                               placeholder="Search by title or author"/>

                    </div>
                </div>
                <div className="search-books-results">
                    { isInitial ?
                        (
                            <div className="loading-block-search loading-block">
                                <div className="search-icon"/>
                                <h1 className="initial-state"> Type something to start search! </h1>
                            </div>
                        ) : ( isLoading ? (

                            <div className="loading-block-search loading-block">
                                <div className="loader"/>
                            </div>

                        ) : ( noResults ? (

                                <div className="loading-block-search loading-block">
                                    <div className="search-icon"/>
                                    <h1 className="initial-state"> No results found for your query. </h1>
                                </div>

                            ) : (
                                <ol className="books-grid">

                                    {
                                        books.map((book) => {

                                            return (
                                                <BookComponent key={book.id} book={book}
                                                               onShelfChange={onShelfChange}
                                                               highlight={this.isMine(book.id)}/>
                                            )

                                        })
                                    }

                                </ol>
                            )
                        ))
                    }
                </div>
            </div>
        )
    }


}

export default SearchComponent