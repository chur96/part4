const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs === [] ? 0 : blogs.reduce((prev, curr) => prev + curr['likes'], 0)
}

const favoriteBlog = (blogs) => {
    return blogs === [] ? 0 : blogs.reduce((prev, curr) => {
        return curr.likes > prev.likes ? curr : prev
    })
}

module.exports = {
    dummy
    ,totalLikes
    ,favoriteBlog
}