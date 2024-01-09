"use server"

import { revalidatePath } from "next/cache";
import Product from "../models/product.model";
import { connectToDB } from "../mongoose";
import { scrapeAmazonProduct } from "../scrapper";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils";
import { Console } from "console";
import { generateEmailBody, sendEmail } from "../nodemailer";
import { User } from "@/types";



 
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

export async function getAllProducts()
{
    try {
        connectToDB();
        const products=await Product.find();
        console.log(products)
        return products;
    } catch (error) {
        console.log(error)
    }
}

export async function getSimilarProducts(productId:string)
{
    try {
        connectToDB();
        const currentPrice=await Product.findById(productId);
        if(!currentPrice) return null;
     const similarProducts=await Product.find(
        {
            _id:{$ne:productId},
        }
     ).limit(3)
     return similarProducts;
    } catch (error) {
        console.log(error)
    }
}

export async function addUserEmailToProduct(productId:string,userEmail:string)
{
try {
    const product=await Product.findById(productId);
    if(!product) return

    const userExists=product.users.some((user:User)=>
    user.email===userEmail);

    if(!userExists)
    {
        product.users.push({email:userEmail});
        await product.save();
        const emailContent=await generateEmailBody(product,"WELCOME");
        await sendEmail(emailContent,[userEmail])
    }


  
} catch (error) {
    console.log(error);
}
}