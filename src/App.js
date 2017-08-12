import React from 'react'
import * as BooksAPI from './BooksAPI'
import BookShelf from './BookShelf'
import './App.css'
import  {groupBy} from 'underscore'

class BooksApp extends React.Component {
    state = {
        /**
         * TODO: Instead of using this state variable to keep track of which page
         * we're on, use the URL in the browser's address bar. This will ensure that
         * users can use the browser's back and forward buttons to navigate between
         * pages, as well as provide a good URL they can bookmark and share.
         */
        showSearchPage: false,
        shelves: {
            read: [],
            wantToRead: [],
            currentlyReading: []
        }
    };

    componentDidMount() {
        BooksAPI.getAll()
            .then((books) => this.setState({shelves: groupBy(books, "shelf")}))
    }

    onShelfChange(event, book) {
        const selectedShelf = event.target.value;

        //checking if the selected shelf exsits
        if (this.state.shelves[selectedShelf]) {

            //updating UI and BACKEND in parallel

            this.setState((previousState) => {

                let newShelves = {...previousState.shelves};

                //removing the book from previous shelf
                let bookIndex = newShelves[book.shelf].indexOf(book);
                newShelves[book.shelf].splice(bookIndex, 1);

                //adding book to new shelf
                newShelves[selectedShelf].push(book);


                return {
                    shelves: newShelves
                }
            });


            BooksAPI
                .update(book, selectedShelf)
        }

    }

    render() {
        return (
            <div className="app">
                {this.state.showSearchPage ? (
                    <div className="search-books">
                        <div className="search-books-bar">
                            <a className="close-search" onClick={() => this.setState({showSearchPage: false})}>Close</a>
                            <div className="search-books-input-wrapper">
                                {/*
                                 NOTES: The search from BooksAPI is limited to a particular set of search terms.
                                 You can find these search terms here:
                                 https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                                 However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                                 you don't find a specific author or title. Every search is limited by search terms.
                                 */}
                                <input type="text" placeholder="Search by title or author"/>

                            </div>
                        </div>
                        <div className="search-books-results">
                            <ol className="books-grid"></ol>
                        </div>
                    </div>
                ) : (
                    <div className="list-books">
                        <div className="list-books-title">
                            <h1>MyReads</h1>
                        </div>
                        <div className="list-books-content">
                            <div>
                                <BookShelf title="Read" onShelfChange={this.onShelfChange.bind(this)}
                                           books={this.state.shelves.read}/>
                                <BookShelf title="Want to read" onShelfChange={this.onShelfChange.bind(this)}
                                           books={this.state.shelves.wantToRead}/>
                                <BookShelf title="Currently reading" onShelfChange={this.onShelfChange.bind(this)}
                                           books={this.state.shelves.currentlyReading}/>
                            </div>
                        </div>
                        <div className="open-search">
                            <a onClick={() => this.setState({showSearchPage: true})}>Add a book</a>
                        </div>
                    </div>
                )}
            </div>
        )
    }
}

export default BooksApp
