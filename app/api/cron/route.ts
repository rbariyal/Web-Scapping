import Product from "@/lib/models/product.model";
import { connectToDB } from "@/lib/mongoose"
import { scrapeAmazonProduct } from "@/lib/scrapper";
import { getAveragePrice, getEmailNotifType, getHighestPrice, getLowestPrice } from "@/lib/utils";

export async function GET()
{
    try {
        connectToDB();
        const products=await Product.find({});
        if(!products) throw new Error("No products found");

//1. Scrape Latest product details & update DB

const updatedProducts=await Promise.all(products.map(async(currentProduct)=>
{
   const scrapedProduct=await scrapeAmazonProduct(currentProduct.url);

   if(!scrapedProduct) throw new Error("No Product found");
   const updatedPriceHistory=[
    ...currentProduct.priceHistory,
    {price:scrapedProduct.currentPrice}
]

const product={
    ...scrapedProduct,
    priceHistory:updatedPriceHistory,
    lowestPrice:getLowestPrice(updatedPriceHistory),
    highestPrice:getHighestPrice(updatedPriceHistory),
    averagePrice:getAveragePrice(updatedPriceHistory)
}


const updatedProduct=await Product.findOneAndUpdate({url:scrapedProduct.url},
product,
)

//2. CHECK EACH PRODUCT'S STATUS & SEND MAIL ACCORDINGLY

const emailNotifType=getEmailNotifType(scrapedProduct,currentProduct)
}))

    } catch (error) {
        throw new Error(`Error in GET:${error}`)
    }
}