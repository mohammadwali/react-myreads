import React from 'react'
import {Route, Link} from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
import BookShelf from './BookShelf'
import SearchComponent from './SearchComponent';
import  {groupBy} from 'underscore'
import './App.css'

class BooksApp extends React.Component {
    state = {
        isLoading: true,
        shelves: {
            read: [],
            wantToRead: [],
            currentlyReading: []
        }
    };

    componentDidMount() {
        BooksAPI.getAll()
            .then((books) => this.setState(() => {

                //not directly assigning group as it will not add the shelf
                // which does not have results
                let group = groupBy(books, "shelf");

                // so here we are making sure that if we don't have any results
                // for the current shelf add empty array there at least
                return {
                    shelves: {
                        read: group.read || [],
                        wantToRead: group.wantToRead || [],
                        currentlyReading: group.currentlyReading || []
                    },
                    isLoading: false
                };

            }))
    }

    getMyBooks() {
        return [].concat(this.state.shelves.read, this.state.shelves.wantToRead, this.state.shelves.currentlyReading);
    }

    onShelfChange(selectedShelf, book) {

        //updating UI and BACKEND in parallel

        this.setState((previousState) => {

            let newShelves = {...previousState.shelves};

            //if book shelf is defined as the search results
            // ( new items ) are not assigned to any shelf
            if (book.shelf) {

                //removing the book from previous shelf
                let bookIndex = newShelves[book.shelf].indexOf(book);
                newShelves[book.shelf].splice(bookIndex, 1);
            }


            //checking if the selected shelf exsits
            if (this.state.shelves[selectedShelf]) {

                book.shelf = selectedShelf;

                //adding book to new shelf
                newShelves[selectedShelf].push(book);

            }

            return {
                shelves: newShelves
            }
        });


        BooksAPI
            .update(book, selectedShelf)
    }

    render() {
        return (
            <div className="app">

                <Route exact path="/search" render={() => {
                    return (<div className="search-books">
                        <SearchComponent myBooks={this.getMyBooks()} onShelfChange={this.onShelfChange.bind(this)}/>
                    </div>)
                }}/>

                <Route exact path="/" render={() => {
                    return (<div className="list-books">
                        <div className="list-books-title">
                            <h1>MyReads</h1>
                        </div>
                        <div className="list-books-content">

                            {this.state.isLoading ? (
                                <div className="loading-block loading-block-search">
                                    <div className="loader"/>
                                </div>
                            ) : (
                                <div>
                                    <BookShelf title="Read" onShelfChange={this.onShelfChange.bind(this)}
                                               books={this.state.shelves.read}/>
                                    <BookShelf title="Want to read" onShelfChange={this.onShelfChange.bind(this)}
                                               books={this.state.shelves.wantToRead}/>
                                    <BookShelf title="Currently reading" onShelfChange={this.onShelfChange.bind(this)}
                                               books={this.state.shelves.currentlyReading}/>
                                </div>
                            ) }


                        </div>
                        <div className="open-search">
                            <Link to="/search">Add a book</Link>
                        </div>
                    </div>)
                }}/>

            </div>
        )
    }
}

export default BooksApp
