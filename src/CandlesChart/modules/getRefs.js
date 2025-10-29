export default function getRefs(...refs) {
  return ref => {
    refs.filter(Boolean).forEach(r => {
      r.current = ref;
    });
  };
}
