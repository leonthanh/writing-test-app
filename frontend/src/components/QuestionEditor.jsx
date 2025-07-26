// components/QuestionEditor.jsx
import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const QuestionEditor = ({ content, setContent }) => {
  return (
    <div style={{ marginBottom: 20 }}>
      <CKEditor
        editor={ClassicEditor}
        data={content}
        onChange={(event, editor) => {
          const data = editor.getData();
          setContent(data);
        }}
        config={{
          toolbar: [
            'undo', 'redo', '|',
            'bold', 'italic', 'underline', '|',
            'numberedList', 'bulletedList', '|',
            'insertTable', 'link', 'imageUpload', 'mediaEmbed', '|',
            'blockQuote', 'codeBlock'
          ],
          image: {
            toolbar: [
              'imageTextAlternative', 'imageStyle:inline',
              'imageStyle:block', 'imageStyle:side'
            ]
          },
          table: {
            contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
          }
        }}
      />
    </div>
  );
};

export default QuestionEditor;
