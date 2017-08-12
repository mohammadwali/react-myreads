import React, {Component} from 'react';
import PropTypes from 'prop-types';


class BookComponent extends Component {

    static propTypes = {
        book: PropTypes.object.isRequired,
        onShelfChange: PropTypes.func.isRequired
    };

    render() {
        const {onShelfChange, book} = this.props;
        const {title, authors, shelf, imageLinks: {thumbnail}} = book;

        return (<li>
            <div className="book">
                <div className="book-top">
                    <div className="book-cover" style={{
                        width: 128,
                        height: 188,
                        backgroundImage: 'url(' + thumbnail + ')'
                    }}/>
                    <div className="book-shelf-changer">
                        <select value={shelf} onChange={(event) => onShelfChange(event, book)}>
                            <option value="none" disabled>Move to...</option>
                            <option value="currentlyReading">Currently Reading</option>
                            <option value="wantToRead">Want to Read</option>
                            <option value="read">Read</option>
                            <option value="none">None</option>
                        </select>
                    </div>
                </div>
                <div className="book-title">{ title }</div>
                <div className="book-authors">{ authors.join(", ") }</div>
            </div>
        </li>)
    };


}

export default BookComponent