# Upload-Image-To-Firebase

## Available Scripts:
### [Stepe 1 Setting Up Firebase uthentication:](https://betterprogramming.pub/how-to-upload-files-to-firebase-cloud-storage-with-react-and-node-js-e87d80aeded1)
First, you need a Firebase account with an active project and a storage bucket opened:

1. Connect to or create a Firebase account.
2. Create a new project.
3. Give your project a name.
4. Activate or don’t activate Google Analytics, it’s up to you.
5. In the left side menu, click on “Authentication”, and then on “Start”.
6. The sign-in method is google.
7. In the left side menu, Project Overview/project setting/General/SDK setup and cofigurations/node, then copy the config code and paste it to Frontend/src/config/firebase-config
8. copy firebaseConfig and past inside backend/firebase-config.json
9. In the left side menu, Project Overview/project setting/Service Accounts/, then click Generate new private key and copy the download file and paste it inside backend/service-account-credentials

### [Stepe 2 Setting Up Firebase Cloud Storage and Authentication:](https://betterprogramming.pub/how-to-upload-files-to-firebase-cloud-storage-with-react-and-node-js-e87d80aeded1)

1. In the left side menu, click on “storage”, and then on “Start”.
2. Rules: A modal opens showing the default rules for read and write access for your bucket. We want to keep authentication for write access. Regarding read access, it depends on your needs. Here we’ll update the rules to make our images publicly readable from their public URL.
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write;
      allow delete;
    }
  }
}
More about Storage security rules in the docs.

3. Location: Choose wisely, you can’t change this later. I live in Paris so I chose europe-west3 which is located in Frankfurt, Germany. You can find the full locations list along with more information about selecting the data location for your project on this Firebase page.

Now you have your default bucket ready to use. In Firebase’s free tier, you can have one and store up to 5 GB. If you need multiple buckets and more space, you’ll need to upgrade your plan accordingly.

Now that we have our storage bucket, we need to generate a private key that our API will use to connect safely to our bucket.

In the left side menu, click on the settings wheel at the top.
Select the “Service accounts” tab.
At the bottom of the page click on the “Generate new private key” button. This will generate a JSON file containing your Firebase account credentials.
You’ll get a warning saying that this private key should be kept confidential and in a safe place, so make sure that wherever you put this file you do not commit it to your remote repo.

As you’ll see in the next step, we’ll create an api/ folder for our server. I’ll store this file inside this folder within a services/ folder. Then I’ll add all JSON files form this folder to my .gitignore:

/api/services/*.json
Now we’re ready for the next step, building the upload API.

For security reasons, we want to handle the authenticated calls from our server, not from the browser where our environment variables containing our sensitive credentials could be accessed more easily.

### Stepe 3 Setting Up Frontend:
1. npm install.
2. npm start.

### Stepe 4 Setting Up Backend:
1. In the left side menu, Project Overview/project setting/general/, then copy projectId and StorageBucket.
2. create .env file and paste them like 
    GCLOUD_PROJECT_ID="------------".
    GCLOUD_STORAGE_BUCKET_URL="------------.appspot.com".
2. npm install
3. npm run dev.
