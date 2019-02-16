// import axios from 'axios'
const fetch = require('node-fetch')
let app = null
const url = "https://hacker-news.firebaseio.com/v0"

const store = {
	perPage: 20,
	page: 1,
	topStories: []
}

export const fetchTopStories = async (fetch) => {
	const results = await fetch(`${url}/topstories.json`)
	return results.json()
}

export const fetchItem = async (fetch, id) => {
	const results = await fetch(`${url}/item/${id}.json`)
	return results.json()
}

export const handleStorySelect = (e, story) => {

	if(story.kids){

		const article = document.getElementById(story.id)

		if(!article.classList.contains('static')){
			renderComments(fetch, story.kids)
			article.classList.add('static')
		}

		article.classList.toggle('js-active')
	}
}

export const renderComments = (fetch, kids) => {

	kids.map(id => {

		fetchItem(fetch, id).then(item => {

			if(!item.deleted){

				console.log(item)

				const div = document.createElement('div')
				div.id = item.id
				div.classList.add('comment')
				div.innerHTML = `<span class="by"><em>${item.by}</em></span> &mdash; ${item.text}`
				document.getElementById(item.parent).appendChild(div)

				if(item.kids){
					renderComments(fetch, item.kids)
				}
			}

		})

	})
}

export const renderStories = (fetchItem, app, stories, perPage, page) => {

	return Promise.resolve(

		stories.map((id, index) => {
			
			if(index < (perPage * page) && index > (perPage * (page-1)) || perPage === -1){ 

				fetchItem(fetch, id).then(story => {

					const article = document.createElement('article')
					article.id = story.id
					article.addEventListener("click", (e)=>{handleStorySelect(e, story)})
					article.innerHTML = `
						<div class="header">
							<div class="title">${story.title} &mdash; <em>${story.by}</em></div>
							<div class="replies">${story.kids ? story.kids.length + ' Comments' : ''}</div>
						<div>
					`			
					document.getElementById('stories').appendChild(article)
				})
			}
		})
	)
}

export const showMore = () => {


	if(store.topStories.length > (store.perPage * store.page)){

		if(!document.getElementById('showMore')){
			const showMore = document.createElement('button')
			showMore.id = "showMore"
			showMore.innerText = 'More...'
			showMore.addEventListener("click", handleShowMore)
			app.appendChild(showMore)
		}

	}else {
		app.removeChild(showMore)
	}
}

export const handleShowMore = () => {
	store.page++
	renderStories(fetchItem, app, store.topStories, store.perPage, store.page)
	showMore()
}

export const init = (elementId) => {

	app = document.getElementById(elementId)
	const storyContainer = document.createElement('div')
	storyContainer.id = 'stories'
	app.appendChild(storyContainer)

	fetchTopStories(fetch).then(stories => {

		store.topStories = [...stories]
		renderStories(fetchItem, app, store.topStories, store.perPage, 1)
		showMore()
	}).catch(err => {
		throw new Error('Error', err)
	})
}

window.addEventListener("DOMContentLoaded", ()=>{	
	init('app')
})