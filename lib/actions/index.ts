"use server"

import { revalidatePath } from "next/cache";
import Product from "../models/product.model";
import { connectToDB } from "../mongoose";
import { scrapeAmazonProduct } from "../scrapper";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils";



 
export async function scrapeAndStoreProduct(productUrl:string)
{
if(!productUrl) return;

try {
    connectToDB();
    const scrapedProduct=await scrapeAmazonProduct(productUrl)
    if(!scrapedProduct) return;

let product=scrapedProduct;

const existingProduct=await Product.find({url:scrapedProduct.url})



if(existingProduct[0])
{
    const updatedPriceHistory:any=[
        ...existingProduct[0].priceHistory,
        {price:scrapedProduct.currentPrice}
    ]

    product={
        ...scrapedProduct,
        priceHistory:updatedPriceHistory,
        lowestPrice:getLowestPrice(updatedPriceHistory),
        highestPrice:getHighestPrice(updatedPriceHistory),
        averagePrice:getAveragePrice(updatedPriceHistory)
    }
}

const newProduct=await Product.findOneAndUpdate({url:scrapedProduct.url},
product,
{upsert:true,new:true}
)
revalidatePath(`/product/${newProduct._id}`)
} catch (error:any) {
    throw new Error(`${error.message}`)
}
}

export async function getProductById(productId:string)
{
try {
    connectToDB();
    const product=await Product.findOne({_id:productId});
    return product;
} catch (error) {
console.log(error)    
}
}