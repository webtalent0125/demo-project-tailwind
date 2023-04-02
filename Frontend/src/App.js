import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signOut,
} from "firebase/auth";

const provider = new GoogleAuthProvider();
provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
const auth = getAuth();

function App() {
  const [authorizedUser, setAuthorizedUser] = useState(
    false || sessionStorage.getItem("accessToken")
  );
  const [img, setImg] = useState();
  const [imgRef, setImgRef] = useState();
  const [selectedFile, setSelectedFile] = useState();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const signInwithGoogle = () => {
    signInWithPopup(auth, provider).then((result) => {
      const user = result.user;
      if (user) {
        user.getIdToken().then((tkn) => {
          sessionStorage.setItem("accessToken", tkn);
          setAuthorizedUser(true);
        });
      }
    });
  };

  const logoutUser = () => {
    signOut(auth)
      .then(() => {
        sessionStorage.clear();
        setAuthorizedUser(false);
        alert("Logged Out Successfully");
      })
      .catch((error) => {
        alert(error);
      });
  };

  const onFileUpload = () => {
    if (selectedFile && selectedFile) {
      setLoading(true);
      let fileData = new FormData();
      fileData.set(
        "image",
        selectedFile,
        `${selectedFile.lastModified}-${selectedFile.name}`
      );

      axios({
        method: "post",
        url: "http://localhost:5000/api/upload",
        data: fileData,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authorizedUser}`,
        },
      }).then((res) => {
        if (res.data.fileName) {
          setLoading(false);
          imgRef.value = "";
          setImg();
          setSelectedFile();
          alert("Uploaded successfully");
          fetch();
        }
      });
    } else {
      alert("Selected file dose not exsit!");
    }
  };

  const handleImg = (e) => {
    if (e.target.files[0]) {
      if (e.target.files[0].type.indexOf("image") === 0) {
        setImg(URL.createObjectURL(e.target.files[0]));
        setSelectedFile(e.target.files[0]);
      } else {
        alert("This file is not supported!");
        imgRef.value = "";
      }
    }
  };

  const handleImgDelete = (value) => {
    if (window.confirm("You want to delete?")) {
      setLoading(true);
      //eslint-disable-line
      axios({
        method: "post",
        url: "http://localhost:5000/api/delete",
        data: { data: value },
        headers: {
          Authorization: `Bearer ${authorizedUser}`,
        },
      }).then((res) => {
        if (res.data.state) {
          setLoading(false);
          alert("Image deleted successfully");
          fetch();
        }
      });
    }
  };

  const fetch = () => {
    axios({
      method: "get",
      url: "http://localhost:5000",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${authorizedUser}`,
      },
    }).then((res) => {
      setImages(res.data.data);
    });
  };

  useEffect(() => {
    fetch();
    //eslint-disable-next-line
  }, []);

  return (
    <>
      {authorizedUser ? (
        <>
          <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
              <div>
                <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
                  Dashboard
                </h2>
                <p className="text-gray-600 text-sm">
                  How about you add some images?
                </p>
              </div>
              <div className="block">
                <div style={{ maxWidth: "100px" }}>
                  {img && <img src={img} alt="no file" />}
                </div>

                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Uploaded file
                </label>
                <input
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  aria-describedby="file_input_help"
                  id="file_input"
                  type="file"
                  ref={(e) => setImgRef(e)}
                  onChange={(e) => handleImg(e)}
                />
                <p
                  className="mt-1 text-sm text-gray-500 dark:text-gray-300"
                  id="file_input_help"
                >
                  SVG, PNG, JPG or GIF (MAX. 200x200px).
                </p>
              </div>
              <div className="flex">
                <button
                  onClick={onFileUpload}
                  className="group relative w-full mr-3 rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Add image
                </button>

                <button
                  onClick={logoutUser}
                  className="group relative w-full ml-3 justify-center hover:text-white rounded-md bg-indigo-200 py-2 px-3 text-sm font-semibold text-indigo-700 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Log out
                </button>
              </div>
              <div className="grid grid-cols-3 gap-4 font-mono text-white text-sm text-center font-bold leading-6 bg-stripes-fuchsia rounded-lg">
                {images.length > 0 &&
                  images.map((value, key) => {
                    return (
                      <div key={"image" + key} className="relative">
                        <img
                          className="drop-shadow-md min-h-full object-contain border border-sky-500"
                          src={
                            "https://firebasestorage.googleapis.com/v0/b/fir-project-c3995.appspot.com/o/" +
                            value.name +
                            "?alt=media&token="
                          }
                          alt="no file"
                        />
                        <span
                          style={{ right: "-11px", top: "-11px" }}
                          className="absolute bg-white p-2 rounded-full text-black border border-black-500 py-0 cursor-pointer"
                          onClick={() => handleImgDelete(value)}
                        >
                          x
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
          {loading && (
            <div className="fixed h-screen w-full left-0 top-0 bg-indigo-500 opacity-50 flex items-center justify-center">
              <div className="px-3 py-1 text-3xl text-white-900 dark:text-white dark:text-white leading-none text-center rounded-full animate-pulse">
                Just a moment...
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-8">
            <div>
              <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
                Hello
              </h2>
              <p className="text-gray-600 text-sm">
                click the button bellow to log in and start uploading amazing
                images!.
              </p>
            </div>
            <div>
              <button
                onClick={signInwithGoogle}
                className="group relative flex w-full justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
