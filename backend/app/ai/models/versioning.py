import re
from typing import Tuple
from app.ai.exceptions import VersionException

class SemanticVersion:
    """
    Parses, validates, and manages model semantic versioning (e.g. v1.4.2-prod or v2.0.0).
    """

    VERSION_REGEX = re.compile(r"^v?(\d+)\.(\d+)\.(\d+)(?:-([a-zA-Z0-9_-]+))?$")

    @classmethod
    def parse(cls, version_str: str) -> Tuple[int, int, int, str]:
        match = cls.VERSION_REGEX.match(version_str)
        if not match:
            raise VersionException(f"Invalid semantic version string: '{version_str}'. Format must be vX.Y.Z[-suffix]")
        major, minor, patch, suffix = match.groups()
        return int(major), int(minor), int(patch), suffix or ""

    @classmethod
    def bump(cls, current_version: str, bump_type: str = "minor", suffix: str = "prod") -> str:
        major, minor, patch, _ = cls.parse(current_version)
        if bump_type == "major":
            major += 1
            minor = 0
            patch = 0
        elif bump_type == "minor":
            minor += 1
            patch = 0
        elif bump_type == "patch":
            patch += 1
        else:
            raise VersionException(f"Invalid bump_type '{bump_type}'. Must be 'major', 'minor', or 'patch'.")

        suf = f"-{suffix}" if suffix else ""
        return f"v{major}.{minor}.{patch}{suf}"

    @classmethod
    def compare(cls, v1: str, v2: str) -> int:
        """Returns 1 if v1 > v2, -1 if v1 < v2, 0 if equal."""
        maj1, min1, pat1, _ = cls.parse(v1)
        maj2, min2, pat2, _ = cls.parse(v2)

        t1 = (maj1, min1, pat1)
        t2 = (maj2, min2, pat2)

        if t1 > t2:
            return 1
        elif t1 < t2:
            return -1
        return 0
