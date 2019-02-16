// import axios from 'axios'
import { fetchTopStories, fetchItem, renderStories, renderComments } from './index'
import { resolve } from 'url';
import { rejects } from 'assert';

const topstories = [19177859, 19174081, 19177077, 19168075]

const app = document.createElement('div')


describe('Fetch Top Stories', ()=>{

	let fetchedUrl = ''
	
	const mockFetch = (url) => {
		fetchedUrl = url
		return Promise.resolve({
			json: () => topstories
		})
	}

	it('Should return an array of story ids', () => {
		
		fetchTopStories(mockFetch).then(res => {
			expect(res).toEqual(topstories)
		})

	})

	it('Uses the correct URL: https://hacker-news.firebaseio.com/v0/topstories.json', ()=>{
		expect(fetchedUrl).toBe('https://hacker-news.firebaseio.com/v0/topstories.json')
	})

})

describe('Render Stories', ()=>{
	let fetchedItemCount = 0
	const mockFetchItem = (id) => {
		return Promise.resolve(fetchedItemCount++)
	}

	it('Only fetches max (n) stories: n=2', ()=>{

		renderStories(mockFetchItem, app, topstories, 2).then(res => {
			expect(fetchedItemCount).toEqual(2)
		})

	})

	it('Fetches all stories', ()=>{
		fetchedItemCount = 0
		renderStories(mockFetchItem, app, topstories, topstories.length).then(res => {
			expect(fetchedItemCount).toEqual(topstories.length)
			console.log(app)
		})

	})
})