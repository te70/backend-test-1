# JestJS tests Test

Using JestJS add these tests to the Part 1 Test

## Add blog post succeeded Test

This test should add a valid blog post with all fields
and check if the returned blog post matched the sent fields


## Add blog post failed Tests

### Add partial blog post fields

This test should add an invalid blog post by not sending some required fields
and check if the returned error message matches the missing fields error message you specified in the Part 1 test

### Add full blog post fields with main_image that exceeds 1MB

This test should add a blog post with the main image exceeding 1MB
and check if the returned error message matches "exceeded image size of 1MB" error message you specified in the Part 1 test

### Add full blog post fields with title that has special characters

This test should add a blog post with the title having special characters
and check if the returned error message matches "title has special characters" error message you specified in the Part 1 test

### Add full blog post fields with ISO date_time

This test should add a blog post with the date_time being ISO string
and check if the returned error message matches "not unix time" error message you specified in the Part 1 test


## Add blog post then Get all blog posts successful Test

Add a valid blog post then Get all blog posts and check if the added blog post was successfully added


## Add blog post then Get all blog posts failed Test

Add an invalid blog post then Get all blog posts and check if the added blog post was not added


## Get token from Generate token API and send to Get image by token API successful Test

Get a token for an image using Generate token API then send this token to Get image by token API 
with the same image path that was used to generate the token and check if it returns the image data successfully (You don't have to check the image data, just check if no error is returned)


## Get token from Generate token API and send to Get image by token API failed Test

Get a token for an image using Generate token API then send this token to Get image by token API 
with a different image path that was used to generate the token and check if it returns the same 
"bad token" error message you specified in the Part 1 test