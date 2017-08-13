import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {isUndefined} from 'underscore'


class BookComponent extends Component {

    static propTypes = {
        book: PropTypes.object.isRequired,
        onShelfChange: PropTypes.func.isRequired,
        highlight: PropTypes.bool
    };

    render() {
        const {onShelfChange, book} = this.props;
        const {title, authors} = book;
        const thumbnail = book.imageLinks ? book.imageLinks.thumbnail : "";

        let shelf = (book.shelf ? book.shelf : "none");
        let highlight = (isUndefined(this.props.highlight) ? true : this.props.highlight);

        return (<li>
            <div className="book">
                <div className="book-top">
                    <div className="book-cover" style={{
                        width: 128,
                        height: 188,
                        backgroundImage: 'url(' + thumbnail + ')'
                    }}/>
                    <div className={ "book-shelf-changer" + ( highlight ? " mine" : "" ) }>
                        <select value={shelf} onChange={(event) => onShelfChange(event.target.value, book)}>
                            <option value="none" disabled> { highlight ? "Move to" : "Add to"}...</option>
                            <option value="currentlyReading">Currently Reading</option>
                            <option value="wantToRead">Want to Read</option>
                            <option value="read">Read</option>
                            <option value="none">None</option>
                        </select>
                    </div>
                </div>
                <div className="book-title">{ title }</div>
                <div className="book-authors">{ authors && authors.join(", ") }</div>
            </div>
        </li>)
    };


}

export default BookComponent