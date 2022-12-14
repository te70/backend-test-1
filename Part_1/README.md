# NodeJS + ExpressJS APIS Test

Using NodeJS and ExpressJS write these APIs
Use any library

## Add blog post API

The API should accept these inputs:
1) title (Min 5 characters, Max 50 characters, No special characters, REQUIRED)
2) description (Max 500 characters, REQUIRED)
3) main_image (ONLY jpg, MAX size 1MB, REQUIRED)
4) additional_images (ONLY jpg, Multiple, MAX size 1MB per image, MAX number of images 5, OPTIONAL)
5) date_time (should be unix time, and not before now, REQUIRED)

What the API does:
1) Validates the inputs based on whats written above, if anything is wrong then send back the error message specifying the issue
2) Compresses the images by 25%
3) Saves images in "images/" folder
4) Removes any left over temporary files used while doing compression (if applicable)
5) Adds reference number incremented from last blog post in "blogs.json"
5) Saves the blog post in "blogs.json" file
6) Return back the added blog post as json

## Get all blog posts API

What the API does:
1) Reads all blog posts from "blogs.json"
2) Formats "date_time" from unix time stamp into ISO string
3) Adds "title_slug" which is a slugified version of the title (ex: My Blog Post -> my_blog_post)
3) Returns blog posts


# Next Step

We want the images to be private, not accessible directly to public
So we will use a token to access the images

## Generate timed token for images API

The API should accept these inputs:
1) image_path

What the API does:
1) Generates a token that will expire after 5 minutes for this exact image_path

## Get image by token API

The API should accept these inputs:
1) image_path
2) token

What the API does:
1) Checks if token is valid (not expired, and is made for the input "image_path"), if invalid then send back an error
2) Sends back the image in a way that browser can display the image (not download it)