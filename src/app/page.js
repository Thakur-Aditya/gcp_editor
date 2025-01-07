// src/app/page.js
import FileUpload from '@/components/FileUpload/FileUpload';
import PointsEditor from '@/components/PointsEditor/PointsEditor';
export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">
        GCP Editor
      </h1>
      <div className="grid gap-6">
        {/* File Upload Section */}
        <section className="p-4 border rounded-lg">
          <h2 className="text-xl font-bold mb-4">Upload GCP File</h2>
          <FileUpload />
          {/* FileUpload component will go here */}
        </section>

        {/* Points Editor Section */}
        <section className="p-4 border rounded-lg">
          <h2 className="text-xl font-bold mb-4">GCP Points Editor</h2>
          <PointsEditor/>
          {/* GCPEditor component will go here */}
        </section>
      </div>
    </main>
  );
}