"use client"

import { scrapeAndStoreProduct } from "@/lib/actions";
import { FormEvent, useState } from "react";
const isValidAmazonProductUrl = (url: string) => {
  try {
    const parsedURL = new URL(url);
    const hostname = parsedURL.hostname;
    //Check if hostname contains amazon.co or amazon.
    if (hostname.includes('amazon.com') || hostname.includes('amazon.') || hostname.endsWith('amazon')) {
      return true;
    }

  } catch (error) {
    return false;
  }
  return false;
}

const SearchBar = () => {

  const [searchPrompt, setsearchPrompt] = useState('');
  const [isLoading, setisLoading] = useState(false)

  const handleSubmit = async(event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isValidLink = isValidAmazonProductUrl(searchPrompt);
    // alert(isValidLink?'Valid link':'Invalid link');

    if (!isValidLink) {
      return alert('Please provide a valid link')
    }
    try {
      setisLoading(true)

      //scrape the product page

      const product=await scrapeAndStoreProduct(searchPrompt);
    } catch (error) {

    } finally {
      setisLoading(false)
    }

  }




  return (
    <form className="flex flex-wrap gap-4 mt-12" onSubmit={handleSubmit}>
      <input type="text" value={searchPrompt} onChange={(e) => setsearchPrompt(e.target.value)} placeholder="Enter product link" className="searchbar-input" />
      <button type="submit" className="searchbar-btn" disabled={searchPrompt === ''}>{isLoading ? 'Searching' : 'Search'}</button>
    </form>
  )
}

export default SearchBar
