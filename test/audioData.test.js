import assert from "node:assert/strict";
import test from "node:test";
import { buildLibrary, mapTrack } from "../src/data/audioTracks.js";

test("a track maps Firestore fields and keeps line breaks in lyrics", () => {
  const track = mapTrack("t1", { title: " Arati ", audioUrl: " https://x/a.mp3 ", imageUrl: "https://x/a.jpg", lyrics: "one\r\ntwo\n", category: "ಆರತಿ" }, "arati");
  assert.deepEqual(track, {
    id: "t1",
    categoryId: "arati",
    title: "Arati",
    audioUrl: "https://x/a.mp3",
    imageUrl: "https://x/a.jpg",
    lyrics: "one\ntwo",
    category: "ಆರತಿ",
  });
});

test("an empty or missing title becomes Untitled track", () => {
  assert.equal(mapTrack("t", { title: "   ", audioUrl: "u" }, "c").title, "Untitled track");
  assert.equal(mapTrack("t", { audioUrl: "u" }, "c").title, "Untitled track");
  assert.equal(mapTrack("t", undefined, "c").title, "Untitled track");
});

test("non-string fields become empty strings", () => {
  const track = mapTrack("t", { title: 5, audioUrl: null, imageUrl: 3, lyrics: {}, category: [] }, "c");
  assert.equal(track.audioUrl, "");
  assert.equal(track.imageUrl, "");
  assert.equal(track.lyrics, "");
  assert.equal(track.category, "");
});

test("the library drops tracks without audio, keeps order and fills in category image and name", () => {
  const library = buildLibrary([
    {
      id: "arati",
      data: { name: " ಆರತಿ ", imageUrl: "https://x/cat.jpg" },
      tracks: [
        { id: "b", data: { title: "B", audioUrl: "https://x/b.mp3", imageUrl: "", category: "" } },
        { id: "gone", data: { title: "No audio", audioUrl: "" } },
        { id: "a", data: { title: "A", audioUrl: "https://x/a.mp3", imageUrl: "https://x/a.jpg", category: "Own" } },
      ],
    },
    { id: "empty", data: {}, tracks: [] },
  ]);
  assert.equal(library.length, 2);
  const [arati, empty] = library;
  assert.equal(arati.name, "ಆರತಿ");
  assert.equal(arati.count, 2);
  assert.deepEqual(arati.tracks.map((t) => t.id), ["b", "a"]);
  assert.equal(arati.tracks[0].imageUrl, "https://x/cat.jpg");
  assert.equal(arati.tracks[0].category, "ಆರತಿ");
  assert.equal(arati.tracks[1].imageUrl, "https://x/a.jpg");
  assert.equal(arati.tracks[1].category, "Own");
  assert.equal(arati.tracks[0].categoryId, "arati");
  assert.equal(empty.name, "empty");
  assert.equal(empty.count, 0);
});
