import React from 'react'
import { Table } from 'reactstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { PATH } from '../constants/config';

export default function SongTable(props) {
  const songList = props.songList;
  console.log(songList);

  if (songList === null) {
    return (
      <div className='loading-animation'></div>
    );
  } else {

    const columns = [{
      dataField: 'username',
      text: 'Uploader',
      sort: true
    }, {
      dataField: 'name',
      text: 'Uploader',
      sort: true
    }, {
      dataField: 'upload_date',
      text: 'Uploader',
      sort: true
    }, {
      dataField: 'download_link',
      text: 'Uploader',
      sort: true
    }, {
      dataField: 'username',
      text: 'Uploader',
      sort: true
    },]

    return (
      <Table bordered striped dark className='mysongs-table'>
        <thead>
          <tr>
            <th>Uploader</th>
            <th>Song Name</th>
            <th>Upload Date</th>
            <th>Audio Track</th>
            <th>Transcription</th>
          </tr>
          {(() => {
            if (songList.length === 0) {
              return (
                <tr>
                  <td colSpan='5'>
                    No songs to be found 
                  </td>
                </tr>
              );
            }
          })()}
          {songList.map((item, index) => (    
            <tr key={item.id}>
              <td>{item.username}</td>

                <td><Link to={PATH.SONG_DETAILS.replace(':songid', item.id)} state={{ song: item }}>{item.name}</Link></td>
              
              <td>{new Date(item.upload_date).toLocaleString()}</td>
              <td>{/**Change to download icon*/}<a href={item.download_link} target='_blank'>{item.download_link != '' ? 'Download' : ''}</a></td>
              <td><a href={item.transcription} target='_blank'>{item.transcription != '' ? 'Download' : ''}</a></td>
            </tr>
          ))}
        </thead>
      </Table>
    );
  }
}
