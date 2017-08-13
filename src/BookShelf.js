import React, {Component} from 'react';
import PropTypes from 'prop-types';
import BookComponent from './BookComponent';


class BookShelf extends Component {

    static propTypes = {
        title: PropTypes.string.isRequired,
        books: PropTypes.array,
        onShelfChange: PropTypes.func.isRequired
    };

    render() {
        const {title, books} = this.props;

        return (
            <div className="bookshelf">
                <h2 className="bookshelf-title">{ title }</h2>
                <div className="bookshelf-books">
                    { books && books.length ? ( <ol className="books-grid">

                        {
                            books.map((book) => {

                                return (
                                    <BookComponent key={book.id} book={book} onShelfChange={this.props.onShelfChange}/>
                                )

                            })
                        }

                    </ol> ) : (<h1> No books left in this shelf. </h1>) }


                </div>
            </div>
        )
    }


}

export default BookShelf