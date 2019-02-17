// import axios from 'axios'
import { fetchTopStories, fetchItem, renderStories, renderComments } from './index'

const storyContainer = document.createElement('div')

const topStories = [19177859, 19174081, 19177077, 19168075]


describe('Fetch Top Stories', ()=>{

	let fetchedUrl = ''
	
	const mockFetch = (url) => {
		fetchedUrl = url
		return Promise.resolve({
			json: () => topStories
		})
	}

	it('Should return an array of story ids', () => {
		
		fetchTopStories(mockFetch).then(res => {
			expect(res).toEqual(topStories)
		})

	})

	it('Uses the correct URL: https://hacker-news.firebaseio.com/v0/topstories.json', ()=>{
		expect(fetchedUrl).toBe('https://hacker-news.firebaseio.com/v0/topstories.json')
	})

})

describe('Render Stories', ()=>{
	let fetchedItemCount = 0
	let perPage = 2
	let page = 1
	
	const mockFetch = () => {
		return Promise.resolve(fetchedItemCount++)
	}

	it('Only fetches max (n) stories: n=2', async ()=>{

		await renderStories(mockFetch, storyContainer, topStories, perPage, page).then(res => {
			expect(fetchedItemCount).toEqual(2)
		})
	})

	it('Fetches all stories', async ()=>{
		fetchedItemCount = 0
		perPage = -1
		page = 1
		
		await renderStories(mockFetch, storyContainer, topStories, perPage, page).then(res => {
			expect(fetchedItemCount).toEqual(topStories.length)
		})
	})

	it('Fetches page 2 of 2 stories per page', async ()=>{
		fetchedItemCount = 0
		perPage = 2
		page = 2
		
		await renderStories(mockFetch, storyContainer, topStories, perPage, page).then(res => {
			expect(fetchedItemCount).toEqual(2)
		})
	})

	it('Fetches page 4 of 1 stories per page', async ()=>{
		fetchedItemCount = 0
		perPage = 1
		page = 4
		
		await renderStories(mockFetch, storyContainer, topStories, perPage, page).then(res => {
			expect(fetchedItemCount).toEqual(1)
		})
	})

	it('Fetches 0 stories when trying to fetch an invalid page ', async ()=>{
		fetchedItemCount = 0
		perPage = 1
		page = 5
		
		await renderStories(mockFetch, storyContainer, topStories, perPage, page).then(res => {
			expect(fetchedItemCount).toEqual(0)
		})
	})
})


describe('Render Comments', ()=>{
	let fetchedItemCount = 0
	
	let mockFetch = () => {
		return Promise.resolve(fetchedItemCount++)
	}

	it('Fetches 3 comments', async ()=>{
		await renderComments(mockFetch, [1,2,3]).then(res => {
			expect(fetchedItemCount).toBe(3)
		})
	})

})