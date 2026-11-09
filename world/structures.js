
  buildWelcome(0, 12);
  buildTracks(-16, 0);
  buildSchedule(16, 0);

  return {
    batches: { static: B },
    planes,
    obstacles,
    hotspots,
    bakes,
  };
}
