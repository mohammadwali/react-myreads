import React from 'react'
import {Route, Link} from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
import BookShelf from './BookShelf'
import SearchComponent from './SearchComponent';
import  {groupBy} from 'underscore'
import './App.css'

class BooksApp extends React.Component {
    state = {
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
                            <Link to="/search">Add a book</Link>
                        </div>
                    </div>)
                }}/>

            </div>
        )
    }
}

export default BooksApp
