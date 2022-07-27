const dummy = (blogs) => { 
    return 1;
}
const totalLikes = (blogs) => { 
    return (
        blogs.map(x => x.likes).reduce((previous, current) => { return (previous + current)})
    )
}
const favoriteBlogs = (blogs) => { 
    return (
    blogs.reduce((previous, current) => { 
        if (previous.likes >= current.likes) { 
            return previous;
        }
        return current;
    })
    )
}
const mostBlogs = (blogs) => { 
    const authors = blogs.map(x => x.author);
    const authorList = {};
    let authorWithMostblogs = null;
    for (let x of authors) { 
        if (!authorList[x]) {
            authorList[x] = 1;
        }
        else { 
            authorList[x] += 1;
        }
    }
    const blogsNumber = Object.values(authorList).reduce((x, y) => {
        if (x >= y) { return x } else { return y}
    })
    console.log(blogsNumber);
    for (let y in authorList) { 
        if (authorList[y] === blogsNumber) { 
            authorWithMostblogs = y;
        }
    }
    return (
        {
            author: authorWithMostblogs,
            blogs: blogsNumber
        }
    )
}

const mostLikes = (blogs) => { 
    const blogs_modified = blogs.map(x => { 
        return ({
            author: x.author,
            likes: x.likes
        })
    })
    const result = blogs_modified.reduce((pre, cur) => { 
        if (pre.likes >= cur.likes) { return pre } else { return cur}
    })
    return result
}
module.exports = {dummy, totalLikes, favoriteBlogs, mostBlogs, mostLikes};