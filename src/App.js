import './App.css';
import { useState, useEffect } from 'react'
import { Auth } from './components/auth'
import { db, auth, storage } from './config/firebase'
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { ref, uploadBytes } from 'firebase/storage'

function App() {
  const [movieList, setMovieList] = useState(null)
  const movieCollectionRef = collection(db, 'movies')

  // New movie state 
  const [newMovieTitle, setNewMovieTitle] = useState('')
  const [newReleaseDate, setNewReleaseDate] = useState(0)
  const [isNewMovieOscar, setIsNewMovieOscar] = useState(false)

  // Update title state
  const [updatedTitle, setUpdateTitle] = useState('')

  // File upload state 
  const [fileUpload, setFileUpload] = useState(null)

  const getMovieList = async () => {    
    try {
        // Read the data
        const data = await getDocs(movieCollectionRef)
        const filteredData = data.docs.map(doc => ({ ...doc.data(), id: doc.id }) )
        // Set the movieList 
        setMovieList(filteredData)
    }
    catch (err) {
      console.log(err)
    }    
  }

  const onSubmit = async () => {
    try {
      const docRef  = await addDoc(movieCollectionRef, { 
        title: newMovieTitle, 
        releaseDate: newReleaseDate,
        receivedAnOscar: isNewMovieOscar,
        userID: auth?.currentUser?.uid })
        console.log("Document written with ID: ", docRef.id);
        getMovieList()
    }
    catch (err) {
      console.log(err)
    }
  }

  const deleteMovie = async (id) => {
    try {
      const movieDoc = doc(db, 'movies', id)
      await deleteDoc(movieDoc);
      getMovieList()
    }
    catch (err)
    {
      console.log(err)
    }
  }

  const updateMovieTitle = async (id) => {
    try {
      const movieDoc = doc(db, 'movies', id)
      await updateDoc(movieDoc, { title: updatedTitle });
      getMovieList()
    }
    catch (err)
    {
      console.log(err)
    }
  }

  const uploadFile = async () => {
    if (!fileUpload) return 
    const fileFolderRef = ref(storage, `projectFiles/${fileUpload.name}`)
    try {
      const result = await uploadBytes(fileFolderRef, fileUpload)
      console.log(result)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getMovieList()
  }, [])

  return (
    <div className="App">
      <h3>Sign In/Up</h3>
      <Auth />

      <hr />
      <div>
        <h3>All movies</h3>                
        { !movieList && <h1>Please wait while loading...</h1> }
        { (movieList?.length === 0) && <h1>No movie found...</h1> }

        { (movieList?.length > 0) && movieList.map(movie => (
          <div key={movie.id}>
            <h1 style={{ color: movie.receivedAnOscar ? 'green' : 'black' }}>{movie.title}</h1>
            <p>Date: {movie.releaseDate}</p>
            <button onClick={ () => deleteMovie(movie.id) }>Delete Movie</button>
            <input placeholder='new title...' onChange={e => setUpdateTitle(e.target.value)}  />
            <button onClick={ () => updateMovieTitle(movie.id) }>Update Title</button>            
          </div>
        ))}
      </div>

      <hr /> 
      <div>
        <h3>Add Movie</h3>
        <div>
          <input type='text' placeholder='Movie title...' 
              onChange={e => setNewMovieTitle(e.target.value)} />
        </div>
        <div>
          <input type='number' placeholder='Release date...' 
              onChange={e => setNewReleaseDate(Number(e.target.value))} />
        </div>
        <div>
          <input type='checkbox' 
              checked={isNewMovieOscar} 
              onChange={e => setIsNewMovieOscar(e.target.checked)} />
          <label>Received an Oscar</label>
        </div>
        <div>
          <button onClick={onSubmit}>Submit Movie</button>
        </div>
      </div>

      <hr />
      <div>
        <h3>Upload file</h3>
        <input type='file' onChange={ e => setFileUpload (e.target.files[0]) }/>
        <button onClick={ uploadFile }>Upload files</button>
      </div>
      
    </div>
  );
}

export default App;

/*
   Firestore - How to get document id after adding a document to a collection
   https://stackoverflow.com/questions/48740430/firestore-how-to-get-document-id-after-adding-a-document-to-a-collection
   
   Get data with Cloud Firestore
   https://firebase.google.com/docs/firestore/query-data/get-data

   Delete data from Cloud Firestore   
   https://firebase.google.com/docs/firestore/manage-data/delete-data

   Firebase V9 Firestore UPDATE Document Data Using updateDoc()
   https://softauthor.com/firebase-firestore-update-document-data-updatedoc/

   Firebase 9 Firestore Get A Document By ID Using getDoc()
   https://softauthor.com/firebase-firestore-get-document-by-id/

   The three arguments of the doc() method are:
   Database → db
   Collection name → cities in this case (see the screenshot above)
   ID of a document → 2l3bcSGs2vZBIc3RODwp in this case (see the screenshot above)

   Call the doc() method, pass three arguments and assign it to a constant called docRef (short form for document reference).

   Invoke the getDoc() method passing docRef as an argument to it.

   The getDoc() method will return a promise, add await keyword in front of it.

   Assign it to a constant called docSnap (short form for document snapshot).

   To get actual document data, call the data() method on the docSnap object.
*/